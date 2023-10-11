from .models import *
from .serializers import *

import platform
import pytesseract
import numpy as np

from PIL import Image

from deep_translator import GoogleTranslator

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class TranslationView(APIView):

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({ "message": "You are not logged in!" }, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            if platform.system() == "Windows":
                pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
                
            image = np.array(Image.open(serializer.validated_data["image"]))
            text = pytesseract.image_to_string(image)
            result = GoogleTranslator(source="auto", target="bg").translate(text=str(text).strip())
            Translation.objects.create(
                user=request.user,
                text=text,
                result=result
            )
            return Response({
                "text": text,
                "result": result
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
