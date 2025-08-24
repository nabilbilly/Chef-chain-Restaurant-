from django.db import models
from django.contrib.auth.models import AbstractUser, User

# class MenuItem(models.Model):  
#     name = models.CharField(max_length=100)
#     description = models.TextField()
#     image = models.ImageField(upload_to='menu_images/')  # 👈 stores in MEDIA_ROOT/menu_images/

#     def __str__(self):
#         return self.name



class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin/Manager'),
        ('rider', 'Rider/Waiter'),
        ('chef', 'Chef/Kitchen'),
        ('customer', 'Customer'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    category = models.ForeignKey(Category,related_name="menu_items",
        null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, default=1 , decimal_places=2)
    image = models.ImageField(upload_to="menu_images/", blank=True, null=True)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# class Order(models.Model):
#     STATUS_CHOICES = [
#         ("pending", "Pending"),
#         ("preparing", "Preparing"),
#         ("served", "Served"),
#         ("completed", "Completed"),
#     ]

#     customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
#     table_number = models.CharField(max_length=10, blank=True, null=True)  # dine-in
#     order_type = models.CharField(max_length=20, choices=[("dine_in", "Dine In"), ("takeaway", "Takeaway")])
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Order #{self.id} - {self.customer.username}"
# models.py
class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('dine_in', 'Dine In'),
        ('takeaway', 'Takeaway'),
        ('delivery', 'Delivery'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
    ]
    
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    table_number = models.CharField(max_length=10, null=True, blank=True)
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='dine_in')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="order_items", on_delete=models.CASCADE)
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.item.name}"

    def get_total_price(self):
        return self.quantity * self.item.price

