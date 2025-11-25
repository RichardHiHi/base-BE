# Sử dụng image Node chính thức
FROM node:18

# Tạo thư mục app trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Mở port
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "dev"]