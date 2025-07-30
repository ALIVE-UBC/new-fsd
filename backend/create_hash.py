# create_hash.py
from django.conf import settings
from django.contrib.auth.hashers import make_password

# This is the same minimal configuration from your main app
if not settings.configured:
    settings.configure(
        SECRET_KEY='a-dummy-secret-key-for-standalone-use',
        PASSWORD_HASHERS=[
            'django.contrib.auth.hashers.PBKDF2PasswordHasher',
            'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
            'django.contrib.auth.hashers.Argon2PasswordHasher',
            'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
        ]
    )

# --- CHOOSE A NEW, SIMPLE PASSWORD ---
new_password = "password123" 

# Generate the hash for the new password
new_hash = make_password(new_password)

print("--- Password Reset Tool ---")
print(f"Password to use: {new_password}")
print("Copy the following hash and update it in your database:")
print(new_hash)