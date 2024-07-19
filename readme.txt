1. Tạo package json
2. setup express web server ( tạo file server.js)
3. Tạo thư mục app và file db.config.js ( dùng để thiết lập mongoDB)
4. Tạo thư mục models và xác định mô hình models:
- Các Mô hình Mongoose này đại diện cho collection user và role trong cơ sở dữ liệu MongoDB.
User: đối tượng sẽ có một role mảng chứa id trong collection role làm tham chiếu.
- Sau khi khởi tạo Mongoose, chúng ta không cần viết hàm CRUD vì Mongoose hỗ trợ tất cả:
+ create a new User: object.save()
+ find a User by id: User.findById(id)
+ find User by email: User.findOne({ email: … })
+ find User by username: User.findOne({ username: … })
+ find all Roles which name in given roles array: Role.find({ name: { $in: roles } })
5. Tạo file index.js trong models
6. Khởi tạo ứng dụng Express, kết nối với cơ sở dữ liệu MongoDB 
được thêm vào bộ sưu tập roles nếu chúng chưa tồn tại
- Tạo các roles khác nhau: admin, IT, và user.
- Phân quyền cho từng role:
+ admin: Quản lý người dùng, tạo, sửa, xóa tất cả các ticket.
+ IT: Tạo, sửa, xóa tất cả các ticket, thêm người dùng với role 'user', sửa thông tin người dùng (không thay đổi role), xóa người dùng có role 'user'.
+ user: Tạo ticket, sửa và xóa ticket của mình, xem danh sách ticket.
7. Định hình JWT ( Tạo thư mục auth.config.js trong folder config)
8. Tạo folder middlewares/verifySignup.js để check username/email hợp lệ và xử lý xác thực role
9.Trong file authJwt.js ở thư mục middlewares xác thực và kiểm tra vai trò người dùng trong ứng dụng Node.js sử dụng JWT và MongoDB. 
Các middleware này sẽ được dùng để bảo vệ các route, đảm bảo rằng chỉ những người dùng có quyền thích hợp mới có thể truy cập:
- Xác thực người dùng bằng JWT (verifyToken).
- Kiểm tra xem người dùng có vai trò "admin" (isAdmin).
- Kiểm tra xem người dùng có vai trò "IT" (isIT).
10. Tạo file index.js trong middleware quản lý các chức năng liên quan đến xác thực (authentication) và kiểm tra đăng ký (signup verification) 
bằng cách gom chúng vào một module duy nhất
11. Tạo folder controller để thiết lập 3 chức năng signup signin và signout
- signup: tạo người dùng mới trong cơ sở dữ liệu MongoDB
- signin:
+ Tìm usernameyêu cầu trong cơ sở dữ liệu, nếu nó tồn tại
+ So sánh password với password cơ sở dữ liệu bằng bcrypt
+ Tạo mã thông báo bằng jsonwebtoken
+ Trả lại thông tin người dùng & Token truy cập
- signout: xóa phiên 
12. Tạo folder controllers/auth.controller.js 
Khởi tảo các hàm xử lý đăng ký, đăng nhập và đăng xuất người dùng, kết hợp sử dụng JWT để xác thực và bcrypt 
để mã hóa mật khẩu, đảm bảo tính bảo mật cho ứng dụng. 
Các hàm này sẽ được sử dụng trong các route để xử lý các yêu cầu tương ứng từ client.
13. Tạo user.controller.js để test API
14. Tạo folder routers/auth.routers 
Thiết lập ba route chính cho việc xác thực người dùng trong một ứng dụng:
/api/auth/signup - Xử lý đăng ký người dùng mới với các kiểm tra điều kiện trước khi cho phép đăng ký.
/api/auth/signin - Xử lý đăng nhập người dùng.
/api/auth/signout - Xử lý đăng xuất người dùng.
15. Tạo user.routers
/api/test/all: Không cần xác thực, bất kỳ ai cũng có thể truy cập (controller.allAccess).
/api/test/user: Yêu cầu xác thực token (authJwt.verifyToken) và cho phép tất cả người dùng (controller.userBoard).
/api/test/IT: Yêu cầu xác thực token và vai trò "IT" (authJwt.verifyToken, authJwt.isIT) và chỉ cho phép người dùng có vai trò "IT" truy cập (controller.ITBoard).
/api/test/admin: Yêu cầu xác thực token và vai trò "admin" (authJwt.verifyToken, authJwt.isAdmin) và chỉ cho phép người dùng có vai trò "admin" truy cập (controller.adminBoard).
16. Tạo database bằng MongoDB
- Sau khi chạy server thì collection role được thiết lập gồm 3 giá trị: admin, IT, user
- Tạo thêm collection user có username, email, password và role
- Tạo trường cho collection user để test API
17. Test API server qua postman
+ test đăng nhập 
+ test đăng kí
+ test đăng xuất
+ test role admin, IT, user
18. Tạo package cho giao diện và sử dụng reactJS để thiết kế giao diện
+ Thiết lập port để không trùng cổng với back-end
19. Thiết kế trang welcome
+ Viết trang welcome có nút login, logo và sử dụng css để thiết kế màu sắc trang welcome
20. Thiết kế trang login
- Trang login bao gồm tài khoản, mật khẩu và logo, có nút đăng nhập để xác thực tài khoản mật khẩu và gửi token mã hóa mật khẩu
sau đó sẽ lưu vào localStorage dưới dạng token xác thực phiên đăng nhập
- Tài khoản: truy vấn database để lấy dữ liệu tài khoản người dùng
+ Nếu nhập thiếu tài khoản sẽ hiển thị thông báo: " Thiếu tài khoản hoặc mật khẩu "
+ Nếu nhập sai tài khoản sẽ hiển thị thông báo: " Tài khoản không tồn tại "
- Mật khẩu: truy vấn database để lấy dữ liệu mật khẩu người dùng 
+ Nếu nhập thiếu mật khẩu sẽ hiển thị thông báo: " Thiếu tài khoản hoặc mật khẩu "
+ Nếu nhập sai mật khẩu sẽ hiển thị thông báo: " Sai mật khẩu "
- Sau khi đã đăng nhập thành công, người dùng sẽ chuyển hướng đến trang Home
- call API accessToken nếu người dùng không đăng nhập mà đưa đường dẫn đến trang Home sẽ redirect trang login
- Code css cho trang login
21. Thiết kế trang Home
- Trang home bao gồm chào mừng người dùng hiện tại nút đăng xuất, thanh menu có mục quản lý người dùng ( chỉ cho admin ) và quản lý ticket 
- Call API để lấy thông tin người dùng hiện tại từ AuthService
- redirect đến trang đăng nhập nếu người dùng hiện tại chưa đăng nhập
- Thiết kế nút đăng xuất 
- Chuyển hướng đến trang Quản lý người dùng ( chỉ cho admin )
- Code css cho trang Home
22. Thiết kế trang quản lý người dùng
- Trang trang quản lý người dùng bao gồm chào mừng người dùng hiện tại
- Nếu đăng nhập bằng role admin sẽ hiển thị thông tin tất cả các người dùng bao gồm: Tài khoản, Email, Vai trò và Hành động
+ Mục hành động có nút Thêm nằm ở góc phải màn hình, Sửa và xóa
* Chức năng thêm: khi click vào button thêm sẽ hiển thị pop-up và form thêm sẽ được hiển thị
+ Khi đã nhập đầy đủ các trường thông tin ( tài khoản, mật khẩu, Vai trò, Email là bắt buộc) click nút tạo mới để thêm người dùng vào database và hiển thị ra trong bảng quản lí người dùng
+ Gọi api để kiểm tra tính duy nhất của tài khoản và email ( nếu trùng tài khoản và email của người dùng khác sẽ hiển thị thông báo lỗi)
* Chức năng Sửa:
+ Hiển thị tài khoản, Email và vai trò hiện tại
+ Mục mật khẩu sẽ được bỏ trống: 
nếu nhập mật khẩu, mật khẩu mới sẽ được cập nhật cho người dùng
nếu không nhập mật khẩu, mật khẩu hiện tại sẽ được giữ nguyên
+ Sau khi click button cập nhật tất cả các trường thông tin đã thay đổi sẽ được cập nhật cho người dùng
+ Gọi api để kiểm tra tính duy nhất của tài khoản và email ( nếu trùng tài khoản và email của người dùng khác sẽ hiển thị thông báo lỗi)
* Chức năng Xóa:
+ Hiển thị pop-up ' Bạn có chắc chắn xóa người dùng ' và có 2 option ' xác nhận' và ' hủy bỏ '
+ Khi click hủy bỏ sẽ bỏ thao tác Xóa
+ Khi click xác nhận người dùng bị xóa sẽ biến mất khỏi database và tất cả dữ liệu sẽ bị Xóa
- call API accessToken nếu người dùng không đăng nhập mà đưa đường dẫn đến trang quản lý người dùng sẽ redirect trang login
- Code css cho trang quản lý người dùng
23. Thiết kế trang quản lý ticket
- Tích hợp với tính năng quản lý ticket vào server.js
- Tạo mô hình ticket trong models tạo file ticket.models.js
- Tạo dịch vụ ticket
-Tạo bộ điều khiển ticket
-Tạo tuyến đường cho tickets
24. Quản lý hiển thị và hành động trên ticket:
- Xây dựng cấu trúc cơ bản:
+ Tạo các thành phần cần thiết: Xây dựng các thành phần giao diện chính như bảng hiển thị ticket, form thêm/sửa ticket, và modal hiển thị chi tiết ticket.
+ Tạo dịch vụ xử lý dữ liệu: Sử dụng các dịch vụ (services) để xử lý các yêu cầu API cho việc lấy, tạo, cập nhật, và xóa ticket.
- Xác định quyền truy cập:
+ Tạo các roles: Định nghĩa các roles admin, IT, và user với các quyền khác nhau.
+ Phân quyền cho từng role:
* admin: Có quyền quản lý người dùng, tạo, sửa, xóa tất cả các ticket.
* IT: Có quyền tạo, sửa, xóa tất cả các ticket, thêm người dùng với role 'user', sửa thông tin người dùng (không thay đổi role), xóa người dùng có role 'user'.
* user: Có quyền tạo ticket, sửa và xóa ticket của mình, và xem danh sách ticket.
- Quản lý giao diện dựa trên quyền truy cập:
+ Hiển thị hoặc ẩn mục quản lý người dùng: Chỉ hiển thị mục "Quản lý người dùng" trên thanh menu nếu người dùng đăng nhập có role admin hoặc IT.
+ Chặn quyền truy cập vào trang quản lý người dùng: Ngăn chặn người dùng không có quyền truy cập vào /UserManagement và hiển thị thông báo "Bạn không có quyền truy cập".
+ Ẩn các trường không cần thiết: Khi người dùng có role user, các mục "Bộ phận xử lý", "Ưu tiên", và "Trạng thái" trong form tạo ticket sẽ bị ẩn.
- Quản lý hành động trên ticket:
+ Quyền sửa và xóa ticket: Người dùng có role user chỉ có thể sửa và xóa các ticket do chính mình tạo. Người dùng có role admin và IT có thể sửa và xóa tất cả các ticket.
+ Hiển thị thông báo khi không có quyền: Sử dụng SweetAlert để hiển thị thông báo khi người dùng không có quyền sửa hoặc xóa ticket.
+ Thiết lập giá trị mặc định:
* Giá trị mặc định khi tạo ticket: Khi người dùng có role user, tự động thiết lập giá trị mặc định cho các trường "Bộ phận xử lý", "Ưu tiên", và "Trạng thái" để đảm bảo tất cả các trường đều được nhập vào cơ sở dữ liệu.
25. Update quản lý ticket:
+ Hiển thị màu sắc khác nhau cho các trạng thái:
+ Màu sắc trạng thái: Thiết lập màu sắc khác nhau cho các trạng thái của ticket để dễ dàng phân biệt:
+ Chưa xử lý: màu cam
+ Đang xử lý: màu xanh lá.
+ Đã xử lý: màu đỏ
+ Cập nhật và tối ưu hóa các hàm và thành phần:
- Tách hàm createTicket và updateTicket: Tách hàm createTicket và updateTicket ra từ hàm handleSubmit để mã nguồn trở nên rõ ràng và dễ bảo trì hơn.
Sử dụng SweetAlert: Sử dụng SweetAlert để hiển thị thông báo sau khi thực hiện các hành động (tạo, sửa, xóa ticket).
Tải và hiển thị danh sách ticket:
- Fetch dữ liệu: Sử dụng API để lấy danh sách ticket từ cơ sở dữ liệu và hiển thị trên giao diện người dùng.
- Làm mới danh sách: Sau khi tạo, sửa, hoặc xóa một ticket, danh sách ticket sẽ được làm mới để hiển thị thông tin mới nhất.
26. Code thêm phần layout:
+ Làm preloaded khi chuyển trang
+ Code fullseen mode
+ Thêm phần contact
+ Thêm footer cho web
+ sidebar menu chứa các mục và chức năng
27. Chức năng phân trang
+ phân trang cho quản lý người dùng
+ phân trang cho quản lý ticket
29. Làm chức năng bộ lọc
+ Lọc theo trạng thái và ưu tiên ( quản lý ticket )
+ Lọc theo vai trò ( người dùng )
30. Thêm API tính tổng số user và ticket
31. Thiết lập cấu hình https cho trang
+ Cài đặt chứng chỉ SSL
32. Làm chức năng bộ lọc, phân trang cho bộ lọc