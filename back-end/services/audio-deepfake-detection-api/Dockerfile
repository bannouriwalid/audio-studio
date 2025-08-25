FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Load env variables inside container
COPY .env .

# Expose port
EXPOSE 5000

# Run app using env var for port
CMD ["sh", "-c", "python main.py"]
