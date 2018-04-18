from os import environ
from os.path import dirname, abspath, join

BASE_DIR = dirname(dirname(abspath(__file__)))

SECRET_KEY = "development-secret-key"

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "django_cleanup",
    "django_filters",
    "rest_framework",

    "client",
    "music",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "server.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # "django.template.context_processors.media"
            ],
        },
    },
]

WSGI_APPLICATION = "server.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": join(BASE_DIR, "db.sqlite3"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = "/static/"

MEDIA_URL = "/media/"

MEDIA_ROOT = "media"

INTERNAL_IPS = [
    "127.0.0.1"
]

# Environment specific settings.
LOCAL_STAGE = "local"
STAGE = environ.get("STAGE", LOCAL_STAGE)
if STAGE != LOCAL_STAGE:
    SECRET_KEY = environ["DJANGO_SECRET_KEY"]
    DEBUG = False
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    ALLOWED_HOSTS += environ["DJANGO_ALLOWED_HOSTS"].split(",")
    INSTALLED_APPS.append("storages")
    DATABASES["default"] = {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "HOST": environ["DJANGO_DATABASE_HOST"],
        "NAME": environ["DJANGO_DATABASE_NAME"],
        "PASSWORD": environ["DJANGO_DATABASE_PASSWORD"],
        "PORT": environ["DJANGO_DATABASE_PORT"],
        "USER": environ["DJANGO_DATABASE_USER"]
    }
    AWS_DEFAULT_ACL = "private"
    AWS_IS_GZIPPED = True
    AWS_STORAGE_BUCKET_NAME = environ["DJANGO_AWS_STORAGE_BUCKET_NAME"]
    AWS_QUERYSTRING_AUTH = False
    DEFAULT_FILE_STORAGE = "server.storage_backends.MediaStorage"
    STATICFILES_STORAGE = "server.storage_backends.StaticStorage"
