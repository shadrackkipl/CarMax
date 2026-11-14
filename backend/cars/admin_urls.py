# cars/admin_urls.py
from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .admin_views import (
    AdminAnnouncementViewSet,
    AdminInquiryViewSet,
    AdminSalesRepViewSet,
    AdminSaleViewSet,
    AdminServiceBookingViewSet,
    AdminSlideViewSet,
    AdminStaffViewSet,
    admin_stats,
)

router = SimpleRouter()
router.register("staff", AdminStaffViewSet, basename="admin-staff")
router.register("sales-reps", AdminSalesRepViewSet, basename="admin-sales-rep")
router.register("slides", AdminSlideViewSet, basename="admin-slide")
router.register("service-bookings", AdminServiceBookingViewSet, basename="admin-service-booking")
router.register("inquiries", AdminInquiryViewSet, basename="admin-inquiry")
router.register("sales", AdminSaleViewSet, basename="admin-sale")
router.register("announcements", AdminAnnouncementViewSet, basename="admin-announcement")

urlpatterns = [
    path("stats/", admin_stats),
    path("", include(router.urls)),
]