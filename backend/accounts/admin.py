from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'designation', 'phone', 'department', 'city', 'is_active')
    list_filter = ('designation', 'is_active', 'department')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'phone')
