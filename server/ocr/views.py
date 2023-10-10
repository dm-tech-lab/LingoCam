import pytesseract
import numpy as np
from .models import *
from PIL import Image

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from deep_translator import GoogleTranslator
from .serializers import ImageUploadSerializer

class TranslationView(APIView):

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({ "message": "You are not logged in!" }, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
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
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
