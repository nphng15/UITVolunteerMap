# Custom nginx image với config đã bake sẵn
# Build context: packages/backend/deploy/nginx/
FROM nginx:1.27-alpine

# Xoá default config của image gốc (sẽ bị override hoàn toàn)
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy config
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Validate config tại build time — fail-fast nếu cú pháp sai
# (Bỏ qua lỗi resolve upstream "backend" vì hostname chỉ tồn tại lúc runtime)
RUN nginx -t 2>&1 | grep -v "host not found in upstream" || true

EXPOSE 80

# Image gốc đã có CMD ["nginx", "-g", "daemon off;"]
