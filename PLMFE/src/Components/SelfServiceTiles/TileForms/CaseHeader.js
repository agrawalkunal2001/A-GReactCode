import React, { useState, useEffect, useRef } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import Select, { components } from "react-select";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";
import CaseInformationAccordion from "./CaseInformationAccordion";
import CaseClaimInformation from "./CaseClaimInformation";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "../../../api/axios.hook";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import MemeberInformationAccordion from "./MemeberInformationAccordion";
import ClaimInformationTable from "../TileFormsTables/ClaimInformationTable";


const CaseHeader = () => {
  const navigate = useNavigate();
  const tabRef = useRef("HomeView");
  const navigateHome = async () => {
    navigate("/DashboardLogin/Home", { replace: true });
    if (prop.state.formView === "DashboardView") {
      const promise = new Promise((resolve, reject) => {
        resolve(updateLockStatus("N", prop.state.caseNumber, 0, ""));
      });

      await promise
        .then(() => {
          setTimeout(() => {
            navigate("/DashboardLogin/Home", { replace: true });
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  let prop = useLocation();

  const caseData = useSelector((store) => store.dashboardNavigationState);
  function filterData() {
    return caseData.data.filter(
      (item) => item?.CaseID !== Number(prop.state.caseNumber)
    );
  }
  const caseheaderConfigData = JSON.parse(process.env.REACT_APP_CASEHEADER_DETAILS || "{}");
  const [potentialDupData, setPotentialDupData] = useState([]);
  const [apiTestState, setApiTestState] = useState({
    delegated: "",
  });

  const [formData, setFormData] = useState({});

  const [buttonDisableFlag, setButtonDisableFlag] = useState(false);

  const [caseHeader, setCaseHeader] = useState({
    caseNumber: "",
    Case_Due_Date: "",
    Case_Owner: "",
    Case_Received_Date: "",
    Case_Status: "",
    Case_Validation: "",
    Environmental_Description: "",
    Extended_Case_Due_Date: "",
    Internal_Due_Date: "",
    Subcase_ID: "",
    White_Glove_Indicator: "",
  });

  const [caseTimelines, setCaseTimelines] = useState({
    caseNumber: "",
    Acknowledgment_Timely: "",
    AOR_Received_Date: "",
    Case_Aging: "",
    Case_Filing_Method: "",
    Case_in_Compliance: "",
    Case_Received_Date: "",
    Compliance_Time_Left_to_Finish: "",
    Out_of_Compliance_Reason: "",
    Timeframe_Extended: "",
    WOL_Received_Date: "",
  });

  const [caseInformation, setCaseInformation] = useState({
    caseNumber: "",
    Appeal_type: "",
    Appellant_Description: "",
    Appellant_Type: "",
    Case_Level_Priority: "",
    Claim_Number: "",
    Denial_Type: "",
    DuplicateRelated_Cases: "",
    Inbound_Email_ID: "",
    Issue_Description: "",
    Issue_Level: "",
    Line_of_Business_LOB: "",
    LOB_Description: "",
    Product: "",
    Product_State: "",
    Product_Type: "",
    RedirectCaseS: "",
    Research_Type: "",
    Review_Type: ""
  });

  const [claimInformation, setClaimInformation] = useState({
    caseNumber: "",
    Authorization_Number: "",
    Claim_Decision: "",
    Claim_Number: "",
    Claim_type: "",
    Decision_Reason: "",
    Denied_As_Of_Date: "",
    Effectuation_Notes: "",
    Original_Denial_Date: "",
    Processing_Status: "",
    Reason_Text: "",
    Service_Type: "",
  });

  // const [claimInformationGrid, setClaimInformationGrid] = useState({
  //   caseNumber: "",
  //   Issue_Number: "",
  //   Line_Number: "",
  //   Allowed_Amount: "",
  //   Auth_Number: "",
  //   Billed_Amount: "",
  //   Number_of_Days_in_Span: "",
  //   Patient_Ref_Account_Number: "",
  //   Place_of_Service_POS: "",
  //   Procedure_Diagnosis_Code_2: "",
  //   Procedure_Diagnosis_Codes: "",
  //   Provider_Account_Number: "",
  //   DRG_Indicator: "",
  //   Service_End_Date: "",
  //   Service_Start_Date: "",
  //   Claim_Status: "",
  //   Claim_Adjusted_Date: "",
  //   Payment_Method: "",
  //   Payment_Number: "",
  //   Payment_Mail_Date_Postmark: "",
  //   Filed_Timely: "",
  //   Good_Cause_Reason: "",
  //   Grant_Good_Cause: "",
  // });

  const [claimInformationGrid, setClaimInformationGrid] = useState([]);

  // const [providerInformationGrid, setProviderInformationGrid] = useState({
  //   caseNumber: "",
  //   Acknowledge_Alert: "",
  //   Address_Line_1: "",
  //   Address_Line_2: "",
  //   City: "",
  //   Communication_Preference: "",
  //   Email_Address: "",
  //   Fax_Number: "",
  //   Issue_Number: "",
  //   Mail_to_Address: "",
  //   Medicaid_ID: "",
  //   Medicare_ID: "",
  //   NPI_ID: "",
  //   Par_Provider_End_Date: "",
  //   Par_Provider_Start_Date: "",
  //   Participating_Provider: "",
  //   Phone_Number: "",
  //   Point_of_Contact: "",
  //   Portal_Enrolled: "",
  //   PR_Representative: "",
  //   Provider_Alert: "",
  //   Provider_Contact_Name: "",
  //   Provider_ID_: "",
  //   Provider_IPA: "",
  //   Provider_Name: "",
  //   Provider_Role: "",
  //   Provider_TIN: "",
  //   Provider_Type: "",
  //   Provider_Vendor_Specialty: "",
  //   Provider_Vendor_Specialty_Description: "",
  //   Sequential_Provider_ID: "",
  //   State_: "",
  //   State_Provider_ID: "",
  //   Vendor_ID: "",
  //   Vendor_Name: "",
  //   Zip_Code: "",
  // });

  const [providerInformationGrid, setProviderInformationGrid] = useState([]);

  const [memberInformation, setMemberInformation] = useState({
    caseNumber: "",
    Address_Line_1: "",
    Address_Line_2: "",
    City: "",
    Communication_Preference: "",
    ContractPlan_ID: "",
    County: "",
    Date_of_Birth: "",
    Deceased: "",
    Dual_Plan: "",
    Email_Address: "",
    Email_ID: "",
    Fax_Number: "",
    Gender: "",
    Mail_to_Address: "",
    Medicaid_ID: "",
    Medicare_ID_HICN: "",
    Member_First_Name: "",
    Member_ID: "",
    Member_IPA: "",
    Member_Last_Name: "",
    Members_Age: "",
    PBP: "",
    PCP_ID: "",
    PCP_NPI_ID: "",
    Phone_Number: "",
    Plan_Code: "",
    Plan_Description: "",
    Plan_Effective_Date: "",
    Plan_Expiration_Date: "",
    Plan_Name: "",
    Preferred_Language: "",
    Primary_Care_Physician_PCP: "",
    Special_Need_Indicator: "",
    State_: "",
    Zip_Code: "",
  });

  const [mainCaseDetails, setMainCaseDetails] = useState({
    flowId: 0,
    stageName: "",
    stageId: 0,
    transactionType: "",
    caseStatus: ""
  })
  CaseHeader.displayName = "Case Header"
  const callProcRef = useRef(null);

  useEffect(() => {
    let caseheaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS
    );
    const stageDetails = {
      ...mainCaseDetails,
      flowId: caseheaderConfigData["FlowId"],
      stageId: caseheaderConfigData["StageId"],
      stageName: caseheaderConfigData["StageName"],
      transactionType: "Case Header",
      caseStatus: "Open",

    };
    setMainCaseDetails(stageDetails);
  }, [])

  useEffect(() => {
    if (
      prop.state.formView !== undefined &&
      prop.state.formView === "DashboardView"
    ) {
      getCaseByCaseNumber();
    }
  }, []);

  useEffect(() => {
    console.log("formdata", formData);
  }, [formData]);

  const handleActionSelectChange = (propertyName, propertyValue) => {
    const updatedData = potentialDupData.map((data) => ({
      ...data,
      [propertyName]: { label: propertyValue, value: propertyValue },
    }));

    setPotentialDupData(updatedData);
  };

  const dispatch = useDispatch();
  const { customAxios } = useAxios();

  const mastersSelector = useSelector((masters) => masters);
  const {
    trimJsonValues,
    extractDate, getTableDetails, getDatePartOnly } = useGetDBTables();
  const {
    submitCase,
    updateLockStatus,
    updateDecision,
    CompareJSON
  } = useUpdateDecision();

  const token = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("token")
      ? mastersSelector.auth.token
      : ""
    : "";
  console.log("axiosmasterselector:", mastersSelector);

  const handleCaseHeaderChange = (value, name) => {
    setCaseHeader({ ...caseHeader, [name]: value });
  };
  const handleCaseTimelinesChange = (value, name) => {
    setCaseTimelines({ ...caseTimelines, [name]: value });
  };
  const handleCaseInformationChange = (value, name) => {
    setCaseInformation({ ...caseInformation, [name]: value });
  }
  const handleClaimInformationChange = (value, name) => {
    setClaimInformation({ ...claimInformation, [name]: value });
  };
  const handleMemberInformationChange = (value, name) => {
    setMemberInformation({ ...memberInformation, [name]: value });
  };

  const getGridDataValues = (tableData) => {
    //var headers = document.getElementById(tableId).headers;
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];
        console.log("data key : ", dataValue, " type: ", dataKeyType);
        if (dataKeys.includes("license") && dataValue === "expirationDate") {
          //console.log('----------------------dataKeyType----------------------', dataKeyType, dataValue, data[dataValue], data[dataValue].value);
        }

        if (dataKeyType === "object") {
          console.log("Inside Data Object if: ", dataObject);
          if (!!data[dataValue]) {
            if (!!data[dataValue].value) {
              if (data[dataValue].value instanceof Date) {
                // dataObject[dataValue] =
                //   data[dataValue].value.toLocaleDateString();
                dataObject[dataValue] = extractDate(data[dataValue].value);
              } else {
                dataObject[dataValue] = data[dataValue].value;
              }
            }

            //Added by Nidhi Gupta on 6/12/2023
            else if (data[dataValue].value == "") {
              dataObject[dataValue] = "";
            } else {
              if (data[dataValue] instanceof Date) {
                //dataObject[dataValue] = data[dataValue].toLocaleDateString();
                dataObject[dataValue] = extractDate(data[dataValue]);
              } else {
                dataObject[dataValue] = data[dataValue];
              }
            }
            // else {
            //      dataObject[dataValue] = '';
            //  }
            //till here
          } else {
            dataObject[dataValue] = "";
          }
          //dataObject[dataValue] = (data[dataValue].value!==undefined)?data[dataValue].value:'');
        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }
      });
      //dataObject.caseNumber = caseNumber;
      returnArray.push(trimJsonValues(dataObject));
    });
    return returnArray;
  };

  const convertToDateObj = (jsonObj) => {
    try {
      const jsonKeys = Object.keys(jsonObj);
      jsonKeys.forEach((elem) => {
        if (elem.includes("#date")) {
          const date = new Date(getDatePartOnly(jsonObj[elem]));
          const oldKey = elem;
          const newKey = elem.split("#")[0];
          jsonObj = renameKey(jsonObj, oldKey, newKey);
          jsonObj[newKey] = date;
        }
      });
      //console.log("Converted JSON: ",jsonObj);
      return jsonObj;
    } catch (error) {
      // Handle the error here
      console.error("An error occurred convertToDateObj:", error);
    }
  };

  const renameKey = (obj, oldKey, newKey) => {
    try {
      console.log(
        "Inside rename key old key = ",
        oldKey,
        " new key = ",
        newKey
      );
      console.log(
        "Inside rename key hasOwnProperty = ",
        obj.hasOwnProperty(oldKey)
      );
      console.log("Inside rename key obj[oldKey] = ", obj[oldKey]);
      console.log("Inside rename key obj[newKey] = ", obj[newKey]);
      if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
      }
      return obj;
    } catch (error) {
      // Handle the error here
      console.error("An error occurred renameKey:", error);
    }
  };

  const submitData = async () => {

    let apiJson = {};

    const angClaimInformationGrid = getGridDataValues(claimInformationGrid);
    console.log("angClaimInformationGridData is array list", angClaimInformationGrid);
    const angProviderInformationGrid = getGridDataValues(providerInformationGrid);

    const angCaseHeader = trimJsonValues({ ...caseHeader });
    const angCaseTimelines = trimJsonValues({ ...caseTimelines });
    const angCaseInformation = trimJsonValues({ ...caseInformation });
    const angClaimInformation = trimJsonValues({ ...claimInformation });
    const angMemberInformation = trimJsonValues({ ...memberInformation });

    apiJson["ANG_Case_Header"] = angCaseHeader;
    apiJson["ANG_Case_Timelines"] = angCaseTimelines;
    apiJson["ANG_Case_Information"] = angCaseInformation;
    apiJson["ANG_Claim_Information"] = angClaimInformation;
    apiJson["ANG_Claim_Information_Grid"] = angClaimInformationGrid;
    apiJson["ANG_Provider_Information_Grid"] = angProviderInformationGrid;
    apiJson["ANG_Member_Information"] = angMemberInformation;

    console.log("apiJson", apiJson);

    let mainCaseReqBody = {
      ...mainCaseDetails,
      caseStatus: "Open",
      lockStatus: "N",
    }

    const flowId = caseheaderConfigData["FlowId"];
    const stageId = caseheaderConfigData["StageId"];
    const stageName = caseheaderConfigData["StageName"];

    apiJson["MainCaseTable"] = mainCaseReqBody;

    console.log("final api", apiJson)
    console.log("grid data", claimInformationGrid);

    const response = await customAxios.post("/generic/create", apiJson, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Data saved successfully: ", response);


    // Handle the response from the create endpoint.
    const apiStat = response.data.CreateCase_Output.Status;

    if (apiStat === -1) {
      alert("Case is not created.");
    }

    if (apiStat === 0) {
      console.log("i am here")
      let procData = {};
      let procDataState = {};
      procDataState.stageName = stageName;
      procDataState.flowId = flowId;
      procDataState.caseNumber = response.data["CreateCase_Output"]["CaseNo"];
      procDataState.decision = "Submit";
      procDataState.userName = mastersSelector.hasOwnProperty("auth")
        ? mastersSelector.auth.hasOwnProperty("userName")
          ? mastersSelector.auth.userName
          : "system"
        : "system";
      procDataState.formNames = CaseHeader.displayName;
      procData.state = procDataState;
      alert(
        "Case created successfully: " +
        response.data["CreateCase_Output"]["CaseNo"]
      );
      console.log(procData);
      submitCase(procData, navigateHome);
    }
  }

  function getCaseByCaseNumber() {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["angTables"];
    getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };
    console.log("getApiJson", getApiJson);

    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Generic get api response: ", res);

        const apiStat = res.data.Status;

        if (apiStat === -1) {
          alert("Error in fetching data.");
        }

        if (apiStat === 0) {
          let data = res.data.data;
          let apiresp = data["angCaseHeader"][0];
          apiresp = convertToDateObj(apiresp);

          apiresp = data["angCaseTimelines"][0];
          apiresp = convertToDateObj(apiresp);

          apiresp = data["angClaimInformation"][0];
          apiresp = convertToDateObj(apiresp);

          apiresp = data["angMemberInformation"][0];
          apiresp = convertToDateObj(apiresp);

          apiresp = data["angClaimInformationGrid"][0];
          apiresp = convertToDateObj(apiresp);

          apiresp = data["angProviderInformationGrid"][0];
          apiresp = convertToDateObj(apiresp);

          setCaseHeader(data["angCaseHeader"][0]);
          setCaseTimelines(data["angCaseTimelines"][0]);
          setCaseInformation(data["angCaseInformation"][0]);
          setClaimInformation(data["angClaimInformation"][0]);
          setClaimInformationGrid(data["angClaimInformationGrid"][0]);
          setProviderInformationGrid(data["angProviderInformationGrid"][0]);
          setMemberInformation(data["angMemberInformation"][0]);

          setFormData(data);

          const caseIDToUpdate = res?.data?.data?.mainTable[0]?.CaseID;
          const indexToUpdate = caseData.data.findIndex(
            (item) => item?.CaseID === caseIDToUpdate
          );

          if (indexToUpdate !== -1) {
            caseData.data[indexToUpdate] = res?.data?.data?.mainTable[0];
          }

          const caseInfo = res?.data?.data?.angCaseInformation[0];
          caseInformation["Product"] = caseInfo.Product;

          dispatch({
            type: "UPDATE_DATA",
            payload: {
              data: caseData.data,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  //update dispatch event
  function dispatchUpdateData(updatedData) {
    dispatch({
      type: "UPDATE_DATA",
      payload: {
        data: updatedData,
      },
    });

    dispatch({
      type: "UPDATE_CASE_STATUS",
      payload: {
        caseSubmitted: true,
      },
    });
  }

  //save and exit button 
  const saveAndExit = async () => {
    console.log(" propLogger : ", prop.state)

    callProcRef.current = "callProc";

    //let updatedData = filterData();

    //const saveType = event.target.name === "saveAndSubmit" ? "SS" : "SE";
    const saveType = "SE";

    let apiJson = {};

    const angCaseHeader = trimJsonValues({ ...caseHeader });
    const angCaseTimelines = trimJsonValues({ ...caseTimelines });
    const angCaseInformation = trimJsonValues({ ...caseInformation });
    const angClaimInformation = trimJsonValues({ ...claimInformation });
    const angMemberInformation = trimJsonValues({ ...memberInformation });
    //const angClaimInformationGrid = getGridDataValues(claimInformationGrid);
    //const angProviderInformationGrid = getGridDataValues(providerInformationGrid);

    apiJson["ANG_Case_Header"] = CompareJSON(angCaseHeader, formData["angCaseHeader"][0]);
    apiJson["ANG_Case_Timelines"] = CompareJSON(angCaseTimelines, formData["angCaseTimelines"][0]);
    apiJson["ANG_Case_Information"] = CompareJSON(angCaseInformation, formData["angCaseInformation"][0]);
    apiJson["ANG_Claim_Information"] = CompareJSON(angClaimInformation, formData["angClaimInformation"][0]);
    apiJson["ANG_Member_Information"] = CompareJSON(angMemberInformation, formData["angMemberInformation"][0]);
    //apiJson["ANG_Claim_Information_Grid"] = angClaimInformationGrid;
    //apiJson["ANG_Provider_Information_Grid"] = angProviderInformationGrid;

    apiJson["caseNumber"] = prop.state.caseNumber;

    customAxios.post("/generic/update", apiJson, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log("Generic update response: ", res);

      const apiStat = res.data.UpdateCase_Output.Status;

      if (apiStat === -1) {
        alert("Error in updating data");
      }

      if (apiStat === 0) {
        updateDecision(prop, saveType, "Case Header");
        let procData = {};
        let procDataState = {};
        procDataState.stageName = prop.state.stageName;
        procDataState.flowId = prop.state.flowId;

        procDataState.caseNumber = prop.state.caseNumber;
        procDataState.decision = prop.state.decision;

        procDataState.decisionReason = prop.state.decisionReason;
        procDataState.userName = mastersSelector.hasOwnProperty("auth")
          ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
          : "system";
        procDataState.formNames = CaseHeader.displayName;
        procData.state = procDataState;
        alert(
          "Case updated successfully: " +
          prop.state.caseNumber
        );
        submitCase(procData, navigateHome);
      }
    });
  }

  const FormComponent = () => (
    <div
      className="accordion AddProviderLabel"
      id="accordionPanelsStayOpenExample"
    >
      <Formik
      >
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              <CaseHeaderAccordion
                //formikFieldsOnChange={formikFieldsOnChange}
                handleOnChange={handleCaseHeaderChange}
                handleData={caseHeader}
              />
              <CaseTimelinesAccordion
                //formikFieldsOnChange={formikFieldsOnChange}
                handleOnChange={handleCaseTimelinesChange}
                handleData={caseTimelines}
              />
              <CaseInformationAccordion
                //formikFieldsOnChange={formikFieldsOnChange}
                handleOnChange={handleCaseInformationChange}
                handleData={caseInformation}
              />
              <CaseClaimInformation
                //formikFieldsOnChange={formikFieldsOnChange}
                handleOnChange={handleClaimInformationChange}
                handleData={claimInformation}
                handleClaimInformationGridData={claimInformationGrid}
                handleProviderInformationGridData={providerInformationGrid}
                handleFormData={formData}
              />
              <MemeberInformationAccordion
                //formikFieldsOnChange={formikFieldsOnChange}
                handleOnChange={handleMemberInformationChange}
                handleData={memberInformation}
              />
            </div>
          </div>
        </div>
      </Formik>
    </div>
  )

  return (
    <div
      className="AddProvider backgroundColor"
      style={{ minHeight: "100vh" }}
    >
      {prop.state.formView === "DashboardView" && <CaseInformation />}

      <div className="container">
        <div className="row">
          <div className="col-xs-6" style={{ textAlign: "center" }}>
            <br />
            <button
              type="button"
              className="btn btn-outline-primary btnStyle"
              onClick={(event) => navigateHome(event)}
              style={{ float: "left", marginLeft: "10px" }}
            >
              Go To Home
            </button>
            <label id="tileFormLabel" className="HeadingStyle">
              Case Header
            </label>

            {prop.state.formView === "DashboardView" ? <>
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                name="saveAndSubmit"
                onClick={(event) => { saveAndExit(event) }}
                style={{ float: "right", marginRight: "10px" }}
              >
                Save & Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                name="saveAndExit"
                onClick={(event) => saveAndExit(event)}
                style={{ float: "right", marginRight: "10px" }}
              >
                Save & Exit
              </button>
            </> : <> <button
              type="button"
              className="btn btn-outline-primary btnStyle"
              name="submit"
              onClick={(event) => submitData(event)}
              style={{ float: "right", marginRight: "10px" }}
            >
              Submit
            </button></>}
          </div>

        </div>
      </div>
      <div className="col-xs-12">

        <div className="container">
          <div className="row">
            {prop.state.formView === "DashboardView" ?
              <Tabs
                defaultActiveKey=" Case Header"
                id="justify-tab-example"
                className="mb-3"
                justify

              >
                <Tab eventKey={' Case Header'} title=' Case Header'>
                  <FormComponent />
                </Tab>

                <Tab eventKey={'Decision'} title='Decision'>
                  <DecisionTab
                    lockStatus={
                      prop.state.lockStatus === undefined ||
                        prop.state.lockStatus === ""
                        ? "N"
                        : prop.state.lockStatus
                    }
                    potentialDupData={potentialDupData}
                    handleActionSelectChange={handleActionSelectChange}
                    delegatedVal={apiTestState?.delegated}
                    buttonClicked={callProcRef.current}
                  ></DecisionTab>


                </Tab>
              </Tabs> :
              <FormComponent />

            }
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaseHeader;

