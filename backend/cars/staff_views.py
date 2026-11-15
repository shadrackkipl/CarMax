# cars/staff_views.py
from django.db.models import Max
from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import (
    action,
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Car, CarImage, Sale, SalesRepresentative
from .serializers import CarImageSerializer, SaleSerializer, StaffCarSerializer


class CarStaffPermission(permissions.BasePermission):
    """
    Allows only signed-in users who hold the matching Django car permission
    (view / add / change / delete). Superusers always pass.
    """

    message = "You do not have permission to do this."

    perms_by_method = {
        "GET": ["cars.view_car"],
        "HEAD": ["cars.view_car"],
        "OPTIONS": [],
        "POST": ["cars.add_car"],
        "PUT": ["cars.change_car"],
        "PATCH": ["cars.change_car"],
        "DELETE": ["cars.delete_car"],
    }

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated and user.is_active):
            return False
        if user.is_superuser:
            return True

        required = getattr(view, "action_perms", {}).get(
            getattr(view, "action", None)
        )
        if required is None:
            required = self.perms_by_method.get(request.method)
        if required is None:
            return False
        return user.has_perms(required)


class StaffCarViewSet(viewsets.ModelViewSet):
    """Create, read, update and delete cars (including unavailable ones)."""

    serializer_class = StaffCarSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [CarStaffPermission]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # Photo uploads and removals count as editing the car
    action_perms = {
        "upload_images": ["cars.change_car"],
        "delete_image": ["cars.change_car"],
    }

    def get_queryset(self):
        return (
            Car.objects.select_related("sale")
            .prefetch_related("images", "sales_representatives")
            .order_by("-created_at")
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="images",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_images(self, request, pk=None):
        car = self.get_object()
        files = request.FILES.getlist("images")
        if not files:
            return Response(
                {"images": "No files were uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        last_order = car.images.aggregate(top=Max("order"))["top"] or 0
        for offset, uploaded in enumerate(files, start=1):
            serializer = CarImageSerializer(
                data={"image": uploaded}, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save(car=car, order=last_order + offset)

        car = self.get_queryset().get(pk=car.pk)
        data = StaffCarSerializer(car, context={"request": request}).data
        return Response(data, status=status.HTTP_201_CREATED)

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"images/(?P<image_id>\d+)",
    )
    def delete_image(self, request, pk=None, image_id=None):
        car = self.get_object()
        image = get_object_or_404(CarImage, pk=image_id, car=car)
        image.image.delete(save=False)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def staff_me(request):
    """Who is signed in and what they may do. Used by the staff panel."""
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.get_username(),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "can": {
                "view": user.has_perm("cars.view_car"),
                "add": user.has_perm("cars.add_car"),
                "change": user.has_perm("cars.change_car"),
                "delete": user.has_perm("cars.delete_car"),
                "sell": user.has_perm("cars.add_sale"),
                "view_sales": user.has_perm("cars.view_sale"),
            },
        }
    )


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([CarStaffPermission])
def staff_sales_reps(request):
    """Names of active sales reps, so staff can assign them to a car."""
    reps = SalesRepresentative.objects.filter(is_active=True).values("id", "name")
    return Response(list(reps))


class StaffSalePermission(CarStaffPermission):
    """Staff may record a sale and view their own sales, nothing more."""

    perms_by_method = {
        "GET": ["cars.view_sale"],
        "HEAD": ["cars.view_sale"],
        "OPTIONS": [],
        "POST": ["cars.add_sale"],
    }


class StaffSaleViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Close a sale (this creates its invoice) and see the invoices you closed.
    Staff cannot edit or delete an invoice: only the administrator can.
    """

    serializer_class = SaleSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [StaffSalePermission]
    http_method_names = ["get", "post", "head", "options"]
    action_perms = {"sellable_cars": ["cars.add_sale"]}

    def get_queryset(self):
        # Everyone sees only the sales they closed themselves
        return Sale.objects.filter(created_by=self.request.user).select_related(
            "car", "created_by"
        )

    @action(detail=False, methods=["get"], url_path="sellable-cars")
    def sellable_cars(self, request):
        """Vehicles that have not been sold yet, for the "Close a sale" form."""
        cars = Car.objects.filter(sale__isnull=True).order_by("-created_at")
        return Response(
            [
                {
                    "id": car.id,
                    "label": f"{car.year} {car.make} {car.model_name}",
                    "stock_number": car.stock_number,
                    "price": str(car.price),
                    "is_available": car.is_available,
                }
                for car in cars
            ]
        )