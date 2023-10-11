from .models import *
from .serializers import *

import os
import openai

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class QAView(APIView):
    
    def post(self, request):
        openai.api_key = os.environ.get("OPENAI_KEY")
        
        if not request.user.is_authenticated:
            return Response({ "message": "You are not logged in!" }, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = QASerializer(data=request.data)

        if serializer.is_valid():
            question = serializer.validated_data["question"]
            context = request.data.get("context")
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are GPT-4 ..."
                    },
                    {
                        "role": "user",
                        "content": question + context
                    }
                ]
            )
    
            answer = ""
            
            for choice in response.choices:
                answer += choice.message.content
                
            QA.objects.create(
                user=request.user,
                question=question,
                context=context,
                answer=answer
            )
                
            return Response({
                "question": question,
                "context": context,
                "answer": answer
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
