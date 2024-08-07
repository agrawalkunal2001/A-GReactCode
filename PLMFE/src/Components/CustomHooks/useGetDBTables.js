import React from "react";

export default function useGetDBTables() {
  const getTableDetails = () => {
    let tableJson = {
      mainTable: ["MainCaseTable~mainTable"],
      decisionTable: ["Decision_History~decisionTable"],
      caseDocumentsTable: ["Prov_CaseDocuments~caseDocumentsTable"],
      pdmCaseDocumentsTable: ["Pdm_CaseDocuments~pdmCaseDocumentsTable"],
      compensationLinear: ["Cont_Compensation_Details~compLinearTable"],
      compGridTables: [
        "Cont_Firl_Grid~firlGrid",
        "Cont_Compensation_Grid~compensationGrid",
      ],
      providerLinear: ["SelfServ_Prov_Details~linearTable"],
      multiPlanTable: ["MULTIPLAN_PUBLISHED~multiPlan"],
      facAncLinear: ["SelfServ_FaciAnci_Details~linearTable02"],
      gridTables: [
        "SelfServ_Speciality_Grid~specialityTable",
        "SelfServ_Location_Grid~locationTable",
        "SelfServ_License_Grid~licenseTable",
        "SelfServ_PayTo_Grid~payToTable",
        "SelfServ_Education_Grid~educationTable",
        "SelfServ_Training_Grid~trainingTable",
        "SelfServ_WorkHistory_Grid~workTable",
        "SelfServ_Insurance_Grid~insuranceTable",
        "SelfServ_Credential_Grid~credentialTable",
        "SelfServ_AdditionalQues_Grid~additionalQuesGrid",
      ],
      provAnciFac: [
        "Cont_ProvFaciAnci_Details~contProvFaciAnci",
        "Cont_Type_Grid~contTypeGrid",
        "Cont_Payment_Grid~contPaymentGrid",
        "Cont_Location_Grid~contLocationGrid",
      ],
      esignTable: ["DocuSignData~esignTable"],
      pdmProviderLinear: ["PDM_PROVIDER_DETAILS~linearTable"],
      pdmAncFacLinear: ["PDM_FACIANCI_DETAILS~linearTable"],
      pdmGridTables: [
        "PDM_SPECIALITY_DETAILS~specialityTable",
        "PDM_LICENSE_DETAILS~licenseTable",
        "PDM_ADDRESS_DETAILS_VIEW~locationTable",
        "PDM_PAYTO_DETAILS~payToTable",
        "PDM_TRAINING_DETAILS~trainingTable",
        "PDM_WORKHISTORY_DETAILS~workTable",
        "PDM_INSURANCE_DETAILS~insuranceTable",
        "PDM_CREDENTIAL_DETAILS~credentialTable",
        "PDM_ADDITIONALQUES_DETAILS~additionalQuesGrid",
      ],
      pdmFacAncLinear: ["PDM_FACIANCI_DETAILS~linearTable"],
      provContLinkTable: ["ProvContLinkTable~provContLinkData"],
      pdmAddressTable: ["PDM_ADDRESS_DETAILS_VIEW~pdmAddress"],
      pdmPayToTable: ["PDM_PAYTO_DETAILS~pdmPayTo"],
      contPotentialDuplicate: ["Cont_PotentialDuplicate~potentialDup"],
      moduleDetailsTable: ["MODULETABLE~moduleTable"],
      provPotentialDuplicate: ["SelfServ_PotentialDuplicate~potentialDup"],
      terminationData: ["SelfServ_Termination_Data~terminationGridValue"],
      networkLinear: ["SelfServ_Network_Details~networkLinearTable"],
      networkGridTables: [
        "SelfServ_HospitalComp_Grid~firlGrid",
        "SelfServ_ProviderComp_Grid~compensationGrid",
      ],
      pdmNetworkLinear: ["PDM_NETWORK_DETAILS~pdmNetworkLinearTable"],
      pdmNetworkGridTables: [
        "PDM_HOSPITALCOMP_DETAILS~pdmFirlGrid",
        "PDM_PROVIDERCOMP_DETAILS~pdmCompensationGrid",
      ],
      pdmSpecialityTable: ["PDM_SPECIALITY_DETAILS~pdmSpeciality"],
      reportPollingTable: ["REPORTPOLLING~ReportPolling"],
      reportDocuments: ["ReportDocuments~ReportDocuments"],
      pdmProvFacAnc: [
        "PDM_CONT_PROVFACIANCI_DETAILS~contPdmLinearTable",
        "PDM_CONT_LOCATION_DETAILS~contPdmLocation",
        "PDM_CONT_PAYMENT_DETAILS~contPdmPayment",
        "PDM_CONT_TYPE_DETAILS~contPdmType",
      ],
      pdmContNetworkLinear: ["PDM_CONT_NETWORK_DETAILS~contPdmNetwork"],
      pdmContCompGridTables: [
        "PDM_CONT_HOSPITALCOMP_DETAILS~contPdmHospital",
        "PDM_CONT_PROVIDERCOMP_DETAILS~contPdmProviderComp",
      ],
      angTables: [
        "ANG_Case_Header~angCaseHeader",
        "ANG_Case_Timelines~angCaseTimelines",
        "ANG_Case_Information~angCaseInformation",
        "ANG_Claim_Information~angClaimInformation",
        "ANG_Claim_Information_Grid~angClaimInformationGrid",
        "ANG_Provider_Information_Grid~angProviderInformationGrid",
        "ANG_Member_Information~angMemberInformation",
        "ANG_Representative_Information_Grid~angRepresentativeInformationGrid",
        "ANG_Authorization_Information~angAuthorizationInformation",
        "ANG_Authorization_Information_Grid~angAuthorizationInformationGrid",
        "ANG_Expedited_Request~angExpeditedRequest"
      ],
    };
    return tableJson;
  };

  const getGridJson = (jsonObj) => {
    //Added by Nidhi Gupta on 10/27/2023
    //Commented by NG as handling will be done while calling this function
    /* if (jsonObj === null || typeof jsonObj !== 'object') {
            console.error('Invalid input in getGridJson: jsonObj is null or not an object');
            return;
        }*/

    //Till Here
    console.log("Inside getGridJson jsonObj: ", jsonObj);
    if (jsonObj !== null || jsonObj !== undefined) {
      const jsonKeys = Object.keys(jsonObj);
      console.log("Inside getGridJson jsonObj1: ", jsonObj);
      jsonKeys.forEach((elem) => {
        const dataKeyType = typeof jsonObj[elem];
        //if(dataKeyType === 'object'){
        //console.log("Inside getGridJson dataKeyType: ", dataKeyType , jsonObj[elem]  , elem);
        if (
          (dataKeyType === "object" &&
            !jsonObj[elem].hasOwnProperty("label") &&
            !jsonObj[elem].hasOwnProperty("value")) ||
          dataKeyType !== "object"
        ) {
          jsonObj[elem] = { label: jsonObj[elem], value: jsonObj[elem] };
        }
        //}
        // if(dataKeyType !== 'object'){
        //     jsonObj[elem] = {'label':jsonObj[elem], 'value':jsonObj[elem]};
        // }

        // Added by Nidhi Gupta on 11/10/2023 form making languages multi select
        else if (
          dataKeyType === "object" &&
          jsonObj[elem].hasOwnProperty("label") &&
          typeof jsonObj[elem]["label"] === "object"
        ) {
          //console.log("came inside here   " ,elem ,   typeof (jsonObj[elem]['label'] ))
          jsonObj[elem] = jsonObj[elem]["label"];
        }
        //till here
      });
      //console.log("Inside getGridJson processedData: ", jsonObj);
      return jsonObj;
    } else {
      console.error(
        "Invalid input in getGridJson: jsonObj is null or not an object"
      );
      return;
    }
  };

  const convertToDateObj = (jsonObj) => {
    const jsonKeys = Object.keys(jsonObj);
    jsonKeys.forEach((elem) => {
      if (elem.includes("#date")) {
        const date = new Date(jsonObj[elem]);
        const oldKey = elem;
        const newKey = elem.split("#")[0];
        jsonObj = renameKey(jsonObj, oldKey, newKey);
        jsonObj[newKey] = date;
      }
    });
    //console.log("Converted JSON: ",jsonObj);
    return jsonObj;
  };

  const renameKey = (obj, oldKey, newKey) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };

  const formatDate = (dateObj) => {
    //console.log("Inside formatDate ", typeof dateObj);

    if (dateObj) {
      if (typeof dateObj === "string") {
        const localDate = new Date(Date.parse(dateObj));

        // console.log("Inside formatDate typeof", Date.parse(dateObj) , localDate.getDate());
        dateObj = localDate;
      } else if (typeof dateObj === "number") {
        const localDate2 = new Date(dateObj);

        // console.log("Inside formatDate typeof: ", localDate2.getDate());
        dateObj = localDate2;
      }
      let dd = dateObj.getDate();
      let mm = dateObj.getMonth() + 1;

      let yyyy = dateObj.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      let formattedDate = mm + "/" + dd + "/" + yyyy;
      //console.log("formattedDate: ", formattedDate);
      return formattedDate;
    }
    return null;
  };

  const trimJsonValues = (inJson) => {
    const dataKeys = Object.keys(inJson);
    //console.log("Inside trimJsonValues01: ", inJson)
    dataKeys.forEach((value) => {
      if (inJson[value] !== undefined && typeof inJson[value] === "string") {
        inJson[value] = inJson[value].trim();
      }
      // if (inJson[value] instanceof Date) {
      //     inJson[value] = inJson[value].toLocaleDateString();
      // }
    });
    //console.log("Inside trimJsonValues02: ", inJson)
    return inJson;
  };

  const getDatePartOnly = (dt) => {
    const formattedDt = dt.replace(/-/g, "/").replace(/T.+/, "");
    return formattedDt;
  };

  const convertToCase = (value) => {
    if (value !== undefined && value !== null) {
      value = value.toString();
      let val = value.toUpperCase();
      return val;
    }
  };

  const checkGridJsonLength = (json) => {
    console.log("Inside checkGridJsonLength final json 1: ", json);
    let flag = false;
    if (Object.keys(json).length === 1) {
      if (json.hasOwnProperty("rowNumber")) {
        flag = true;
      }
    }

    /*else{
            if(json.hasOwnProperty("rowNumber")){
                delete json["rowNumber"];
            }

            let cnt = 0;
            Object.keys(json).forEach((el) => {
                console.log("json.value",json[el].value);
                const val = json[el].value.trim();
                if(val === ''){
                    cnt++;
                }
            })
            console.log("Inside checkGridJsonLength final json: ",Object.keys(json).length);
            console.log("Inside checkGridJsonLength final json count: ",cnt);

            if(cnt === Object.keys(json).length){
                flag = true;
            }
        }
        console.log("Inside checkGridJsonLength final json flag: ",flag);*/
    return flag;
  };

  const acceptNumbersOnly = (e) => {
    console.log("EE", e);
    if (e !== undefined && e !== null) {
      let Value = e.toString();
      var newValue = Value.replace(new RegExp(/[^\d]/, "ig"), "");
      console.log("new value", newValue);
      return newValue;
    }
  };

  const extractDate = (dateVal) => {
    let retDate = "";
    if (dateVal instanceof Date) {
      let day = dateVal.getDate();
      day = day < 10 ? "0" + day : day;
      let month = dateVal.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      const year = dateVal.getFullYear();

      retDate = `${year}-${month}-${day}`;
      console.log("Inside getDatePart extracted date: ", retDate);
    }
    return retDate;
  };

  const getJsonFromFormikState = (initState, formikState) => {
    console.log("Inside getJsonFromFormikState initState ===== ", initState);
    console.log(
      "Inside getJsonFromFormikState formikState ===== ",
      formikState
    );
    let retJson = {};
    Object.keys(initState).forEach((elem) => {
      if (formikState.hasOwnProperty(elem)) {
        retJson[elem] = formikState[elem];
      }
    });

    console.log("Final JSON Created from getJsonFromFormikState: ", retJson);
    return retJson;
  };

  return {
    getTableDetails,
    getGridJson,
    convertToDateObj,
    formatDate,
    trimJsonValues,
    getDatePartOnly,
    convertToCase,
    checkGridJsonLength,
    acceptNumbersOnly,
    extractDate,
    getJsonFromFormikState,
  };
}
