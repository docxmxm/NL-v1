from django.contrib import admin
from .models import Course, CourseEnrollment

# Register your models here.
admin.site.register(Course)
admin.site.register(CourseEnrollment)
