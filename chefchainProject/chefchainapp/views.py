from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, permissions, viewsets

from .models import Category, MenuItem, Order, User
from .serializers import (
    MenuItemSerializer,
    RegisterSerializer,
    UserSerializer,
    CustomTokenSerializer,
    CategorySerializer,
    OrderSerializer,
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


# ----------------------------
# ✅ Orders (Protected)
# ----------------------------
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
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

