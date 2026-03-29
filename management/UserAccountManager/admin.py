'''Admin configuration for User and Profile models.'''
from django.contrib import admin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from UserAccountManager.models import User, Profile


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ['email', 'is_staff', 'is_superuser', 'is_active', 'is_deleted']
    list_filter = ['is_staff', 'is_deleted']

    fieldsets = [
        (None, {'fields': ['email', 'password']}),
        ('Personal info', {'fields': ['first_name', 'last_name', 'is_staff', 'is_superuser']}),
        ('Groups', {'fields': ('groups',)}),
        ('Permissions', {'fields': ['user_permissions', 'is_active']}),
        ('Soft Delete', {'fields': ['is_deleted', 'deleted_at']}),
    ]

    add_fieldsets = [
        (
            None,
            {
                'classes': ['wide'],
                'fields': ['email', 'password1', 'password2'],
            },
        ),
    ]

    search_fields = ['email']
    ordering = ['email']
    filter_horizontal = []


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'firstname', 'lastname', 'is_deleted']
    list_filter = ['is_deleted']
    search_fields = ['user__email', 'firstname', 'lastname']
    readonly_fields = ['created_at', 'updated_at']


admin.site.register(User, UserAdmin)
