# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, RegisterView, CustomLoginView, CategoryListView, OrderListView, OrderCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'menu', MenuItemViewSet, basename='menu')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("orders/", OrderListView.as_view(), name="order-list"),
    path("orders/create/", OrderCreateView.as_view(), name="order-create"),
    
]


# from django.urls import path
# from . import views
# from .views import *
# from rest_framework_simplejwt.views import TokenRefreshView

# urlpatterns = [
#     # path('test/', TestConnectionView.as_view(), name='test-connection'),
#     path('menu/', MenuItemListCreateView.as_view(), name='menu-list-create'),
    
#     path('register/', RegisterView.as_view(), name='register'),
#     path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
#     path('refresh/', TokenRefreshView.as_view(), name='token_refresh'), # /refresh/ → Refresh token for logged in users
    
#     path("categories/", CategoryListView.as_view(), name="category-list"),  # /categories/ → All categories with their items
#     path("menu/", MenuItemListView.as_view(), name="menu-list"), # /menu/ → All available menu items
#     path("orders/", OrderListView.as_view(), name="order-list"), # /orders/ → Customer’s orders (must be logged in)
#     path("orders/create/", OrderCreateView.as_view(), name="order-create"), # /orders/create/ → Place an order
    
# ]