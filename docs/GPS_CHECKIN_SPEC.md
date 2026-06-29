# GPS Check-in Feature - Frontend Specification

## Tổng quan

Tính năng cho phép Volunteer/Leader check-in trong chiến dịch bằng GPS. App lấy vị trí hiện tại của user, gửi lên server, server xác minh vị trí nằm trong bán kính điểm check-in của đội hình mà user đang thuộc về và ghi nhận điểm danh.

## Roles

| Role | Quyền check-in | Quyền xem history |
|------|----------------|-------------------|
| volunteer | Có | Chỉ của mình |
| leader | Có | Chỉ của mình |
| admin | Không khuyến nghị; cần thuộc team mới qua validation | Chỉ của mình |

> Account volunteer được admin tạo thủ công. RoleId = 3.

---

## API Endpoints

### 1. POST /api/checkin

Check-in vào một Campaign.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "campaignId": 1,
  "latitude": 10.8700,
  "longitude": 106.8030
}
```

**Validation rules:**
- `campaignId`: integer, positive, bắt buộc
- `latitude`: number, -90 đến 90, bắt buộc
- `longitude`: number, -180 đến 180, bắt buộc

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "checkInId": 1,
    "campaignId": 1,
    "accId": 5,
    "latitude": 10.8700,
    "longitude": 106.8030,
    "distance": 45.23,
    "checkedInAt": "2026-05-28T09:30:00.000Z"
  },
  "message": "Check-in successful"
}
```

**Error Responses:**

| Status | Error | Mô tả |
|--------|-------|--------|
| 400 | `Team check-in location is not configured` | Đội hình chưa được Leader cấu hình điểm check-in |
| 400 | `Campaign is not currently active` | Ngày hiện tại nằm ngoài startDate - endDate |
| 400 | Validation error | Body không hợp lệ |
| 401 | Token required / expired | Chưa đăng nhập hoặc token hết hạn |
| 403 | `You are not within the allowed check-in radius` | Khoảng cách vượt quá bán kính cho phép |
| 404 | `Campaign not found` | campaignId không tồn tại |
| 404 | `You are not assigned to a team in this campaign` | User chưa thuộc đội hình trong campaign này |
| 409 | `You have already checked in to this campaign today` | Đã check-in campaign này trong ngày |

---

### 2. GET /api/checkin/history

Lấy lịch sử check-in của user hiện tại.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "checkInId": 1,
      "campaignId": 1,
      "accId": 5,
      "latitude": 10.8700,
      "longitude": 106.8030,
      "distance": 45.23,
      "checkedInAt": "2026-05-28T09:30:00.000Z",
      "campaign": {
        "campaignId": 1,
        "campaignName": "Tình nguyện mùa hè 2026",
        "startDate": "2026-05-01",
        "endDate": "2026-06-30",
        "description": "...",
        "latitude": 10.8700,
        "longitude": 106.8030,
        "checkInRadius": 100
      }
    }
  ]
}
```

**Error Responses:**

| Status | Error | Mô tả |
|--------|-------|--------|
| 401 | Token required / expired | Chưa đăng nhập |

---

### 3. GET /api/users/me/campaign

Response trả chiến dịch hiện tại của user kèm team và điểm check-in chính thức của team:

```json
{
  "campaignId": 1,
  "campaignName": "...",
  "startDate": "2026-05-01",
  "endDate": "2026-06-30",
  "description": "...",
  "teamId": 3,
  "teamName": "Đội 1",
  "teamCheckInLatitude": 10.8700,
  "teamCheckInLongitude": 106.8030,
  "teamCheckInRadius": 100,
  "hasCheckedIn": false,
  "checkedInAt": null
}
```

> `teamCheckInLatitude`, `teamCheckInLongitude`, `teamCheckInRadius` có thể null nếu leader chưa cấu hình điểm check-in cho team.

---

## User Flow (Android)

### Flow chính: Volunteer check-in

```
1. Volunteer mở app → đăng nhập
2. Vào màn hình Check-in (từ bottom nav hoặc campaign detail)
3. Chọn Campaign muốn check-in (hiển thị danh sách campaigns đang active)
4. Bấm nút "Check-in"
5. App request location permission (nếu chưa grant)
6. App lấy GPS hiện tại (high accuracy)
7. App gửi POST /api/checkin
8. Hiển thị kết quả:
   - Thành công: hiện distance + thời gian check-in
   - Thất bại: hiện error message tương ứng
```

### Flow xử lý permission

```
1. Kiểm tra permission đã granted chưa
2. Nếu chưa → hiện rationale dialog giải thích tại sao cần GPS
3. Request permission
4. Nếu denied → hiện thông báo hướng dẫn vào Settings
5. Nếu granted → tiếp tục lấy GPS
```

---

## UI Requirements

### Màn hình Check-in

**State: Chưa chọn campaign**
- Dropdown/list các campaign đang active (startDate <= today <= endDate)
- Chỉ bật check-in khi team hiện tại có `teamCheckInLatitude/teamCheckInLongitude`
- Nút Check-in disabled

**State: Đã chọn campaign**
- Hiện thông tin campaign (tên, ngày, mô tả)
- Nút "Check-in" enabled
- Hiện bán kính cho phép (vd: "Bán kính: 100m")

**State: Đang check-in (loading)**
- Nút disabled, hiện spinner
- Text: "Đang xác minh vị trí..."

**State: Thành công**
- Icon success
- "Check-in thành công!"
- Hiện khoảng cách: "Khoảng cách: 45m"
- Hiện thời gian: "Thời gian: 09:30 28/05/2026"

**State: Lỗi**
- Hiện error message từ API
- Nút "Thử lại"
- Nếu OUT_OF_RANGE: hiện khoảng cách thực tế (nếu có)

### Màn hình History (optional, có thể phase 2)

- Danh sách check-in đã thực hiện
- Mỗi item: tên campaign, ngày giờ, khoảng cách
- Sắp xếp mới nhất trước

---

## Technical Notes cho Android

### Permissions cần thêm (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Dependency
```kotlin
implementation("com.google.android.gms:play-services-location:21.3.0")
```

### Location Provider
- Dùng `FusedLocationProviderClient`
- Priority: `PRIORITY_HIGH_ACCURACY`
- Timeout: 10 giây
- Nếu không lấy được location → hiện lỗi, cho retry

### Haversine (tham khảo - server tính)
Server dùng công thức Haversine để tính khoảng cách giữa GPS của user và tọa độ check-in của team. Bán kính mặc định 100m nếu team chưa có radius. FE có thể tính khoảng cách để hiển thị, nhưng kết quả hợp lệ/không hợp lệ do server quyết định.

---

## Data Models (Android)

### Request
```kotlin
data class CheckInRequest(
    val campaignId: Int,
    val latitude: Double,
    val longitude: Double
)
```

### Response
```kotlin
data class CheckInResponse(
    val checkInId: Int,
    val campaignId: Int,
    val accId: Int,
    val latitude: Double,
    val longitude: Double,
    val distance: Double,
    val checkedInAt: String
)
```

### Campaign (mở rộng)
```kotlin
data class Campaign(
    val campaignId: Int,
    val campaignName: String,
    val startDate: String,
    val endDate: String,
    val description: String?,
    val latitude: Double?,
    val longitude: Double?,
    val checkInRadius: Double?
)
```

---

## Edge Cases cần xử lý

| Case | Xử lý |
|------|--------|
| GPS tắt | Hiện dialog yêu cầu bật GPS |
| Permission denied permanently | Hướng dẫn vào Settings > App > Permissions |
| Không có internet | Hiện lỗi network, cho retry |
| Campaign hết hạn giữa chừng | Server trả 400, FE hiện message |
| Check-in 2 lần trong ngày | Server trả 409, FE hiện "Bạn đã check-in hôm nay" |
| GPS accuracy thấp | Cân nhắc hiện warning nếu accuracy > 50m |
| Mock location detected | Optional: kiểm tra `Location.isMock()` và cảnh báo |

---

## Testing Checklist

- [ ] Check-in thành công khi đứng trong bán kính
- [ ] Hiện lỗi khi đứng ngoài bán kính
- [ ] Hiện lỗi khi campaign chưa có GPS
- [ ] Hiện lỗi khi campaign hết hạn
- [ ] Không cho check-in 2 lần/ngày
- [ ] Permission flow hoạt động đúng (grant/deny/permanently denied)
- [ ] Loading state hiển thị đúng
- [ ] History hiển thị đúng sau khi check-in
- [ ] Xử lý khi GPS tắt
- [ ] Xử lý khi mất mạng
