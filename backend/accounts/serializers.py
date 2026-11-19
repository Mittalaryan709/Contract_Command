"""
accounts/serializers.py
Serializers for User registration, login, profile and password change.
"""
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserProfile
        fields = ['designation', 'phone', 'department', 'city', 'is_active']


class UserSerializer(serializers.ModelSerializer):
    """Read serializer – returns user + profile + groups."""
    profile = UserProfileSerializer(read_only=True)
    groups  = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'full_name', 'is_active', 'date_joined', 'groups', 'profile']

    def get_groups(self, obj):
        return list(obj.groups.values_list('name', flat=True))

    def get_full_name(self, obj):
        return obj.get_full_name()


class RegisterSerializer(serializers.ModelSerializer):
    """Create a new user with profile."""
    password          = serializers.CharField(write_only=True, min_length=8)
    confirm_password  = serializers.CharField(write_only=True)
    designation       = serializers.ChoiceField(choices=UserProfile.DESIGNATION_CHOICES)
    phone             = serializers.CharField(max_length=15, required=False, default='')
    department        = serializers.CharField(max_length=100, required=False, default='')
    city              = serializers.CharField(max_length=100, required=False, default='')

    class Meta:
        model  = User
        fields = ['username', 'email', 'first_name', 'last_name',
                  'password', 'confirm_password', 'designation', 'phone',
                  'department', 'city']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        designation      = validated_data.pop('designation')
        phone            = validated_data.pop('phone', '')
        department       = validated_data.pop('department', '')
        city             = validated_data.pop('city', '')
        validated_data.pop('confirm_password')

        user = User.objects.create_user(**validated_data)

        # Assign to the matching Django Group
        group, _ = Group.objects.get_or_create(name=designation)
        user.groups.add(group)

        UserProfile.objects.create(
            user=user, designation=designation,
            phone=phone, department=department, city=city,
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value
