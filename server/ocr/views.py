import easyocr
import numpy as np

from .models import *

from .serializers import ImageUploadSerializer

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
            image = np.array(Image.open(serializer.validated_data["image"]))
            reader = easyocr.Reader(["en", "de"], gpu=False)
            extraction = str().join(reader.readtext(image, detail=0))
            translation = GoogleTranslator(source="auto", target="bg").translate(text=str(extraction).strip())
            Translation.objects.create(user=request.user, text=extraction, result=translation)
            
            return Response({
                "extraction": extraction,
                "translation": translation
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
