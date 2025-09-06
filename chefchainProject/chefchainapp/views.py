from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, permissions, viewsets

from .models import Category, MenuItem, Order, User, OrderItem
from .serializers import (
    MenuItemSerializer,
    RegisterSerializer,
    UserSerializer,
    CustomTokenSerializer,
    CategorySerializer,
    OrderSerializer,
    OrderItemSerializer,
)

# ----------------------------
# ✅ Register (Public)
# ----------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# ✅ Login (Public - JWT)
# ----------------------------

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


# ----------------------------
# ✅ Categories (Public)
# ----------------------------
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# ----------------------------
# ✅ Menu Items (Public)
# ----------------------------
class MenuItemListCreateView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]  # 👈 make public

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get("category")
        search = self.request.query_params.get("search")

        if category_id:
            queryset = queryset.filter(category__id=category_id)

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset




class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Check if user has a pending cart order
        pending_order = Order.objects.filter(
            customer=self.request.user, 
            status="pending"
        ).first()
        
        if pending_order:
            # Update the existing pending order
            pending_order.table_number = serializer.validated_data.get('table_number')
            pending_order.order_type = serializer.validated_data.get('order_type', 'dine_in')
            pending_order.status = 'confirmed'
            pending_order.save()
            return pending_order
        else:
            # Create new order
            serializer.save(
                customer=self.request.user,
                status='confirmed'
            )


# In your views.py - Update OrderListView to include all orders for kitchen staff
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  # You might want to add kitchen staff permission

    def get_queryset(self):
        # For kitchen staff, show all orders
        # For customers, show only their orders
        if self.request.user.is_staff:  # or custom kitchen staff permission
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(customer=self.request.user)

# Add order update view
class OrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  # Add kitchen staff permission
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

# Get current cart
class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        order, created = Order.objects.get_or_create(
            customer=request.user, status="pending"
        )
        return Response(OrderSerializer(order).data)


# Add item to cart
class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order, created = Order.objects.get_or_create(
            customer=request.user, status="pending"
        )
        item_id = request.data.get("item")
        quantity = int(request.data.get("quantity", 1))
        try:
            menu_item = MenuItem.objects.get(id=item_id)
        except MenuItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        order_item, created = OrderItem.objects.get_or_create(order=order, item=menu_item)
        if not created:
            order_item.quantity += quantity
        else:
            order_item.quantity = quantity
        order_item.save()

        return Response(OrderSerializer(order).data)


# Update item quantity / remove
class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            order_item = OrderItem.objects.get(pk=pk, order__customer=request.user, order__status="pending")
        except OrderItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=404)

        quantity = int(request.data.get("quantity", 1))
        if quantity <= 0:
            order_item.delete()
        else:
            order_item.quantity = quantity
            order_item.save()

        return Response(OrderSerializer(order_item.order).data)



# Add this to your existing views.py file

class OrderHistoryView(generics.ListAPIView):
    """
    Get order history for the authenticated customer
    Only shows completed orders (not pending cart items)
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return orders for the authenticated user that are not pending
        return Order.objects.filter(
            customer=self.request.user,
            status__in=['confirmed', 'preparing', 'ready', 'delivered']
        ).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    """
    Get detailed view of a specific order for the authenticated customer
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow customers to see their own orders
        return Order.objects.filter(customer=self.request.user)














# from django.shortcuts import render
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .models import *
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework import generics, serializers, status , permissions
# from .serializers import MenuItemSerializer,RegisterSerializer, UserSerializer,CustomTokenSerializer,CategorySerializer, MenuItemSerializer, OrderSerializer

# # Create your views here.


# # class TestConnectionView(APIView):
# #     permission_classes = [AllowAny]  # 👈 Make it public

# #     def get(self, request):
# #         return Response({"messages": "Chef Chain App Opening soon"})

# class MenuItemListCreateView(generics.ListCreateAPIView):
#     queryset = MenuItem.objects.all()
#     serializer_class = MenuItemSerializer
#     permission_classes = [AllowAny]
    
    

# class RegisterView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class CustomLoginView(TokenObtainPairView):
#     serializer_class = CustomTokenSerializer
    
    

# # from rest_framework import generics, permissions
# # from .models import Category, MenuItem, Order
# # from .serializers import CategorySerializer, MenuItemSerializer, OrderSerializer

# class CategoryListView(generics.ListAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     permission_classes = [permissions.AllowAny]


# # class MenuItemListView(generics.ListAPIView):
# #     queryset = MenuItem.objects.filter(available=True)
# #     serializer_class = MenuItemSerializer


# class OrderCreateView(generics.CreateAPIView):
#     serializer_class = OrderSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(customer=self.request.user)


# class OrderListView(generics.ListAPIView):
#     serializer_class = OrderSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Order.objects.filter(customer=self.request.user)

# # views.py
# from rest_framework import viewsets
# from .models import MenuItem
# from .serializers import MenuItemSerializer

# class MenuItemViewSet(viewsets.ModelViewSet):
#     queryset = MenuItem.objects.all()
#     serializer_class = MenuItemSerializer

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         category_id = self.request.query_params.get("category")
#         search = self.request.query_params.get("search")

#         if category_id:
#             queryset = queryset.filter(category__id=category_id)

#         if search:
#             queryset = queryset.filter(name__icontains=search)

#         return queryset

# class MenuItemListView(generics.ListAPIView):
#     serializer_class = MenuItemSerializer

#     def get_queryset(self):
#         queryset = MenuItem.objects.all()
#         category_id = self.request.query_params.get("category")
#         search = self.request.query_params.get("search")

#         if category_id:
#             queryset = queryset.filter(category_id=category_id)
#         if search:
#             queryset = queryset.filter(name__icontains=search)

#         return queryset

