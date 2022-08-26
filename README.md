# 나혼자안산다 [7조]
- 이민섭, 신동하, 윤채원, 이종한, 이주현
- 1인 가구를 위한 1/N 커뮤니티

# 1. 프로젝트명
- 나혼자안산다
![](https://velog.velcdn.com/images/m1nsuppp/post/6d5fa369-3c91-4b03-b4aa-ee8cc9cf511a/image.png)

# 2. 소개
- 통계청의 '2021 통계로 보는 1인 가구'에 따르면 2020년 기준 전체 가구 10가구 중 3가구(31.7%)가 1인가구로 전체 가구 중 가장 큰 비율을 차지했으며, 계속 늘어나고 있다. 하지만 1인 가구에게는 여러가지 어려움이 있다. 1인 가구는 균형 잡힌 식사(42.4%)에서 가장 큰 어려움을 느꼈다. 대부분의 할인 마트 및 대형 마트는 1인 가구가 부패 전 소비하기 쉽지 않은 많은 양의 식재료를 저렴하게 판매하기 때문이다. 이외에도 배달 최소 주문금액에 대한 문제점과 인터넷 쇼핑 역시 대량 판매를 한다는 것이 문제이다. 그리고 '나혼자 안산다'는 이를 해결하기 위한 공동 구매 플랫폼이다.

# 3. 와이어프레임
![](https://velog.velcdn.com/images/m1nsuppp/post/81871b2b-c81c-4d0c-a1a1-c8b7f22e2613/image.png)


# 4. 개발한 기능들
|기능|Method|URL|request|response|
|--------|------|--------|--------|--------|
|로그인|POST|/api/signin|{ 'accountEmail': accountEmail, 'pw': pw }|success message(Boolean)|
|로그아웃||/api/||
|회원가입|POST|/api/signup|{ 'accountEmail': accountEmail, 'pw': pw, 'phone': phoen, }|success message(Boolean)|
|회원가입 유효성, 중복 확인|POST|/api/signup/valid|{ 'accountEmail': accountEmail, 'pw': pw, }|success message(Boolean)|
|게시물 작성|POST|/api/upload|{ 'boardEmail': accountEmail, 'img': img, 'title': title, 'category': category, 'content': contetnt, 'price': price, 'participant': participant, 'date': date, }|게시물의 작성자 email, 제목, 이미지, 카테고리, 내용, 가격, 인원 수|
|게시물 삭제|DELETE|/api/detail/delete|{ 'boardId': boardId, 'boardEmail': boardEmail, 'accountEmail': accountEmail, }|게시물 삭제|
|게시물 확인(상세 페이지 이동)|GET|/api/detail?id={boardId}|...|게시물 상세 페이지 |
|댓글 작성|POST|/api/detail?id={boardId}/reply|{ 'boardId': boardId, 'accountEmail': accountEmail, 'replyContent': replyContent, 'date': date, }|댓글 작성자의 email, 댓글 내용, 댓글 작성 시간|
|카테고리 검색|GET|/api/categorinized/{category}|{ 'category': category, }|카테고리와 일치하는 페이지
|프로필 조회|GET|/api/profile/|{ 'accountEmail': accountEmail, }|email과 일치하는 프로필 페이지
|추천|POST|/api/profile|{ 'favorite': favorite, }|추천 수 증가
|프로필 업로드|POST|/api/profile/upload|{ 'profileImg': profileImg, { 'accountEmail': accountEmail, }, }|프로필 업로드
|나눔 참여하기|POST|/api/like| { 'accountEmail': accountEmail, 'like': like, 'boardId', boardId, }|나눔 참여하기
------
# 시연영상 📸

<div align=center>
https://youtu.be/-q2evmg4cE8
</div>

------
#  문제 해결 :mag: 

- jinja를 이용해서 서버에서 사용자의 데이터를 받는 과정

- 파이썬에서 값을 줄때 mongodb 커서가 출력되는문제
  - list형태가 아닌 그냥 find로 찾은 데이터는 가장먼저 커서가 존재함 
  for in 구문을 사용하여 분리하던가 아니면 list형태로 파이썬에서 받아오는 방식을 선택함

- <script>와 jinja를 둘다 사용해야하는 경우
  - <head>에서 스크립트를 사용하는것이 아닌 <body> 내부에서 script를 형성해 작업함


- 페이지 변경시 바로 출력되야하는 스크립트
  - $(document).ready(functon(){})형식으로 바로 출력할수 있도록 함

- 값이 정수가 아닌 str형식으로 들어오는 jinja
  - 파이프라인을 사용하여 정수,json 등등으로 교체하여 사용함

- 전체적으로 db에서 필요한 값을  전부 count 해야함
  - 파이썬에서 하나씩 가져와서 리스트화 시켜 클라이언트로 전송



<div align=center>


</div>
