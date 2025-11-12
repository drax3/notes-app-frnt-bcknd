from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

User = get_user_model()

class CustomUserModelTests(TestCase):

    def setUp(self):
        """Set up resuable data and helpers"""
        self.email = "default@example.com"
        self.password = "pass123"
        self.user = User.objects.create_user(email=self.email, password=self.password)

    def create_user(self, email="testuser@example.com", password="testpass123", role="user", **kwargs):
        """Resuable helper to create users"""
        return User.objects.create_user(email=email, password=password, role=role, **kwargs)

    def test_user_created_successfully(self):
        """Check default user created in setup"""
        self.assertTrue(self.user.check_password(self.password))
        self.assertEqual(self.user.role, "user")

    def test_create_manager_user(self):
        user = self.create_user(email="maanger@example.com", role="manager")
        self.assertEqual(user.role, "manager")

    def test_create_admin_user(self):
        user = User.objects.create_superuser(email="admin@example.com", password="adminpass")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertEqual(user.role, "admin")

    def test_duplicate_email_not_allowed(self):
        with self.assertRaises(IntegrityError):
            self.create_user(email=self.email)  # same as setup user

    def test_email_normalized(self):
        user = self.create_user(email="Test@Example.com")
        self.assertEqual(user.email, "Test@example.com")
