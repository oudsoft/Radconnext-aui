module.exports = function ( jq ) {
	const $ = jq;

  function doShowMore(hosId){
    alert(hosId);
  }

  function doOpenNewHospitalForm() {
    $("#HospitalList").empty();
    $("#HospitalList").hide();
    $("#HospitalNewForm").show();
    $("#HospitalNewForm").center();
    $("#CancelCmd").click(()=>{
      $("#HospitalList").show();
      $("#HospitalNewForm").hide();
      const main = require('../main.js');
      main.doShowHospital();
    })
  }

  function doBackToHome() {
    window.location.replace('/');
  }

  const doCallHospitalList = function(){
    return new Promise(function(resolve, reject) {
      var Uri = '/api/hospital/';
      $.ajax({
				type: 'GET',
				url: Uri ,
				headers: {
					authorization: localStorage.getItem('token')
				}
			}).then(function(httpdata) {
				resolve(httpdata);
			});
  	});
  }

  const doShowHospitalList = function(){
    doCallHospitalList().then((response) => {
      console.log(JSON.stringify(response));
      $("#HospitalList").empty();
      $("#HospitalList").append("<h2>Hospital List</h2>");
      let hospitalTable = $("<table width='100%' border='1'></table>");
      $(hospitalTable).appendTo($("#HospitalList"));
      let newHosCmdRow = $("<tr></tr>");
      $(hospitalTable).append($(newHosCmdRow));
      let newHosCmdCol = $("<td colspan='4' align='right'></td>");
      $(newHosCmdRow).append($(newHosCmdCol));
      let newHosCmd = $("<input type='button' value=' New...'/>");
      $(newHosCmd).appendTo($(newHosCmdCol));
      $(newHosCmd).on('click', ()=>{
        doOpenNewHospitalForm();
      });
      let backCmd = $("<input type='button' value=' Back '/>");
      $(backCmd).appendTo($(newHosCmdCol));
      $(backCmd).on('click', ()=>{
        doBackToHome();
      });

      $(hospitalTable).append("<tr><td width='5%' align='center'>No</td><td width='25%' align='center'>Name</td><td width='50%' align='center'>Address</td><td width='*' align='center'>...</td></tr>");
      response.hospitals.forEach((item, i) => {
        let hosRow = $("<tr></tr>");
        $(hosRow).appendTo($(hospitalTable));
        $(hosRow).append("<td align='center'>" + (i+1) + "</td><td align='left'>"+ item.Hos_Name + "</td><td align='left'>"+ item.Hos_Address + "</td>");
        let hosCmdCol = $("<td align='center'></td>");
        $(hosCmdCol).appendTo($(hosRow));
        let moreCmd = $("<input type='button' value=' More... '/>");
        $(moreCmd).appendTo($(hosCmdCol));
        $(moreCmd).on('click', ()=>{
          doShowMore(item.id);
        });
      });

      //{"status":{"code":200},"hospitals":[{"id":1,"Hos_Name":"ชาตรีเวช","Hos_Address":"400 ถ.ชาตรี ต.ชาตรี อ.ชาตรี จ.ชาตรี","Hos_Tel":"0123456789","Hos_WebUrl":"www.chatrivech.com","Hos_Contact":"contactus@chatrivech.com","Hos_Remark":"first class for everyone.","Hos_RootPathUri":"chatrivech"}]}
    });
  }

	return {
    doCallHospitalList,
    doShowHospitalList
	}
}
