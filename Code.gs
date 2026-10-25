/**
 * 자극 24시간 후 응답 설문 (LOC26) - Google Sheets 실시간 수집용 Apps Script
 * IRB 승인본(9.자극 24시간 후 설문.pdf) 22문항 구조 기준.
 *
 * 배포 방법:
 * 1. 응답을 저장할 새 Google Sheet를 만든다.
 * 2. 상단 메뉴 확장 프로그램(Extensions) > Apps Script 클릭.
 * 3. 기본 코드(Code.gs)를 모두 지우고 이 파일 내용을 붙여넣기.
 * 4. 저장 후 우측 상단 배포(Deploy) > 새 배포(New deployment) 클릭.
 * 5. 유형 선택(⚙) > 웹 앱(Web app) 선택.
 *    - 실행 계정(Execute as): 나(Me)
 *    - 액세스 권한(Who has access): 모든 사용자(Anyone)
 * 6. 배포(Deploy) 클릭 → 권한 승인(본인 Google 계정으로 승인) → 생성된
 *    웹 앱 URL(.../exec 로 끝남)을 복사한다.
 * 7. 이 URL을 index.html의 GOOGLE_SCRIPT_URL 상수에 붙여넣는다.
 *
 * 코드를 수정한 뒤에는 "새 배포"가 아니라 기존 배포에서 "관리(Manage
 * deployments) > 편집(연필 아이콘) > 버전: 새 버전 > 배포"로 갱신해야
 * 같은 URL이 유지된다.
 */

var HEADERS = [
  '제출시각(서버)', '연구참여번호', '응답날짜', 'Period', 'Day',
  '집착VAS', '주의분산VAS', '충동강도VAS', '배고픔VAS', '괴로움VAS',
  '조절상실횟수',
  '사건1_발생시각', '사건1_지속시간', '사건1_음식종류', '사건1_조절VAS', '사건1_죄책감VAS',
  '사건2_발생시각', '사건2_지속시간', '사건2_음식종류', '사건2_조절VAS', '사건2_죄책감VAS',
  '자유기술'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    var data = JSON.parse(e.postData.contents);
    var val = function (x) { return (x !== undefined && x !== null) ? x : ''; };

    sheet.appendRow([
      new Date(),
      val(data.participantId),
      val(data.responseDate),
      val(data.period),
      val(data.day),
      val(data.vasPreoccupation),
      val(data.vasDistraction),
      val(data.vasDailyUrge),
      val(data.vasHunger),
      val(data.vasDistress),
      val(data.locCount),
      val(data.event1Time),
      val(data.event1Duration),
      val(data.event1Food),
      val(data.event1ControlVas),
      val(data.event1GuiltVas),
      val(data.event2Time),
      val(data.event2Duration),
      val(data.event2Food),
      val(data.event2ControlVas),
      val(data.event2GuiltVas),
      val(data.freeText)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput('OK - LOC26 24h survey endpoint is running.');
}
