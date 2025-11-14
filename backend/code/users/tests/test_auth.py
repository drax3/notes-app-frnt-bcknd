from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class JWTAuthTests(APITestCase):

    def setUp(self):
        self.email = "testuser@example.com"
        self.password = "strongpassword123"
        self.user = User.objects.create_user(
            email=self.email,
            password=self.password,
            role="user"
        )
        self.token_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')

    def test_obtain_token_success(self):
        response = self.client.post(self.token_url, {
            "email": self.email,
            "password": self.password
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_obtain_token_invalid_credentials(self):
        response = self.client.post(self.token_url, {
            "email": self.email,
            "password": "wrongpassword"
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token_success(self):
        refresh_token = RefreshToken.for_user(self.user)
        response = self.client.post(self.refresh_url,{
            "refresh": str(refresh_token),
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_access_protected_view_with_token(self):
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        response = self.client.get("api/users/", HTTP_AUTHORIZATION=f"Bearer {access_token}")
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
