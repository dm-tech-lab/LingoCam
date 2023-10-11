from .models import *
from .serializers import *

import easyocr
import numpy as np

from PIL import Image

from deep_translator import GoogleTranslator

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

reader = easyocr.Reader(["en"])

class TranslationView(APIView):

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({ "message": "You are not logged in!" }, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            image = np.array(Image.open(serializer.validated_data["image"]))
            text = str().join(reader.readtext(image, detail=0))
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
