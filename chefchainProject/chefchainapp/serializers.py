from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

     

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        
        


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "role")

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            role="customer"  # ✅ default role for new users
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add extra fields
        token["role"] = user.role
        token["username"] = user.username
        token["email"] = user.email   # optional, useful for frontend

        return token

class MenuItemSerializer(serializers.ModelSerializer): 
    category = serializers.StringRelatedField() #

    class Meta:
        model = MenuItem
        fields = ["id", "name", "description", "price", "image", "available", "category"]


class CategorySerializer(serializers.ModelSerializer): 
    items = MenuItemSerializer(many=True, read_only=True) 

    class Meta:
        model = Category
        fields = ["id", "name", "description", "items"]


class OrderItemSerializer(serializers.ModelSerializer):
    item = MenuItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=MenuItem.objects.all(), source="item", write_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "item", "item_id", "quantity", "get_total_price"]


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ["id", "customer", "table_number", "order_type", "status", "created_at", "order_items"]

    def create(self, validated_data):
        items_data = validated_data.pop("order_items")
        order = Order.objects.create(**validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        return order




class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source="item.name")
    price = serializers.ReadOnlyField(source="item.price")
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "item", "item_name", "price", "quantity", "total_price"]

    def get_total_price(self, obj):
        return obj.get_total_price()




        
# orders/serializers.py
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ["id", "customer", "table_number", "order_type", "status", "order_items", "created_at"]
        read_only_fields = ["customer"]  # Customer will be set automatically