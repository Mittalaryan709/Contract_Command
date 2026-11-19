"""
accounts/views.py
JWT-based auth endpoints: register, login, logout, profile, change password.
"""
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from common.responses import success_response, error_response
from .models import UserProfile
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Create a new user (Admin only in prod)."""
    queryset         = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response('Validation failed.', serializer.errors)
        user = serializer.save()
        return success_response(
            UserSerializer(user).data,
            message='User registered successfully.',
            http_status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — Returns access + refresh JWT tokens."""
    permission_classes = [AllowAny]


class LogoutView(APIView):
    """POST /api/auth/logout/ — Blacklists the refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return error_response('Refresh token is required.')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return success_response(message='Logged out successfully.')
        except Exception:
            return error_response('Invalid or expired token.')


class ProfileView(APIView):
    """GET/PUT /api/auth/profile/ — Retrieve or update own profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return success_response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data

        user.first_name = data.get('first_name', user.first_name)
        user.last_name  = data.get('last_name',  user.last_name)
        user.email      = data.get('email',       user.email)
        user.save()

        profile = user.profile
        profile.phone      = data.get('phone',      profile.phone)
        profile.department = data.get('department', profile.department)
        profile.city       = data.get('city',       profile.city)
        profile.save()

        return success_response(UserSerializer(user).data, 'Profile updated.')


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ — Change own password."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response('Validation failed.', serializer.errors)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return success_response(message='Password changed successfully.')


class UserListView(generics.ListAPIView):
    """GET /api/auth/users/ — List all users (Admin only)."""
    queryset         = User.objects.select_related('profile').prefetch_related('groups').all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Administrator').exists() or user.is_superuser:
            return User.objects.select_related('profile').prefetch_related('groups').all()
        return User.objects.none()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)
