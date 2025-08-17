from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
# Register your models here.


# @admin.register(MenuItem)
# class MenuItemAdmin(admin.ModelAdmin):
#     list_display = ['id', 'name', 'description']
    



# Customize how the User model shows in admin
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email',)}),
        ('Permissions', {'fields': ('role', 'is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'role', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)






# from django.contrib import admin
# from .models import Category, MenuItem, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = ("name",)


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "price", "available")
    list_filter = ("category", "available")
    search_fields = ("name", "description")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "order_type", "status", "table_number", "created_at")
    list_filter = ("status", "order_type")
    search_fields = ("customer__username", "table_number")
    inlines = [OrderItemInline]

    # --- Custom Actions ---
    actions = ["mark_as_preparing", "mark_as_completed", "mark_as_cancelled"]

    def mark_as_preparing(self, request, queryset):
        updated = queryset.update(status="Preparing")
        self.message_user(request, f"{updated} order(s) marked as Preparing.")

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status="Completed")
        self.message_user(request, f"{updated} order(s) marked as Completed.")

    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status="Cancelled")
        self.message_user(request, f"{updated} order(s) marked as Cancelled.")

    mark_as_preparing.short_description = "Mark selected orders as Preparing"
    mark_as_completed.short_description = "Mark selected orders as Completed"
    mark_as_cancelled.short_description = "Mark selected orders as Cancelled"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "item", "quantity")
    list_filter = ("item",)



admin.site.register(User, CustomUserAdmin)