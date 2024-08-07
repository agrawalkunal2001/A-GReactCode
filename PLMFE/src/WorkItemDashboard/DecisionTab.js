import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import documentDownloadImage from "../Images/DocumentDownloadImage.png";
import documentUploadImage from "../Images/DocumentUploadImage.png";
import viewDocumentImage from "../Images/viewDataLogo.png";
import axios from "axios";
import customAxios from "../api/axios";
import { useLocation } from "react-router-dom";
import FileUpload from "./DashboardFileUpload/FileUpload";
import { useSelector, useDispatch } from "react-redux";
import useGetDBTables from "../Components/CustomHooks/useGetDBTables";
import { getMasterDecision, getMasterDocumentName } from "../actions";
import { getMasterDecisionReason } from "../actions";
import DashboardLogin from "./DashboardLogin";
import { useAxios } from "../api/axios.hook";
import { BeatLoader } from "react-spinners";
import { Modal } from "react-bootstrap";
import useUpdateDecision from "../Components/CustomHooks/useUpdateDecision";
import "./DecisionTab.css";
import DocumentVersion from "./DocumentVersion";
import useCallApi from "../Components/CustomHooks/useCallApi";
import DecisionHistoryModal from "./DashboardModals/DecisionHistoryModal";
import DocumentViewer from "../Components/CommonComponents/DocumentViewer";
import { GrView } from "react-icons/gr";
import useSwalWrapper from "../Components/SweetAlearts/hooks";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

//export default function DecisionTab({potentialDupData,handleActionSelectChange}) {
export default function DecisionTab(tabInput) {
  const [modalShow, setModalShow] = useState({
    FileUpload: false,
    Version: false,
    HistoryModal: false,
  });

  const { printConsole, disableAllElements, changeColorOfSelect } =
    useUpdateDecision();

  const [fileState, setFileState] = useState([]);

  const { getTableDetails, convertToDateObj, formatDate, convertToCase } =
    useGetDBTables();

  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const selectRef = useRef(null);

  const [decHistoryGrid, setDecisionHistory] = useState([]);

  const [flowId, setFlowId] = useState();
  const [docViewDialog, setDocViewDialog] = useState({
    open: false,
    url: "",
    fileName: "",
    fileType: "",
  });
  const Swal = useSwalWrapper();
  const docClickedIndex = useRef({});

  const { fileUpDownAxios } = useAxios();
  const { downloadFile } = useCallApi();
  const { esignAxios } = useAxios();
  const [showLoader, setShowLoader] = useState(false);
  const override = {
    display: "block",
    position: "fixed",
    top: "40%",
    left: "40%",
    zIndex: "1000",
    margin: "0 auto",
  };

  const mainWIObject = {};
  //mainWIObject.flowId="2"

  //const {handleSelectChange,handleLinearFieldChange} = useUpdateDecision();

  let prop = useLocation();
  console.log("logger prop ", prop.state)
  const formName = prop.state.formNames;
  const stageName = prop.state.stageName && prop.state.stageName.trim();
  const [selectValues, setSelectValues] = useState({});
  const [selectReasonValues, setReasonSelectValues] = useState([]);
  const [decisionReasonArray, setDecisionReasonArray] = useState({})

  let restrictedFileTypes = ["xls", "eps", "sql", "xlsx", "docx"];
  const downloadedfileBlob = (index, documentData) => {
    const { caseNumber, documentType, documentName, docUploadPath } =
      documentData[index] || {};

    if (!caseNumber && !documentType && !documentName) {
      Swal.fire({
        icon: "error",
        title: "Please Upload The File First",
      });
      return;
    }

    const caseId = Number(caseNumber) ?? 0;
    const fileData = new FormData();
    if (docUploadPath !== undefined) {
      fileData.append("downloadFilePath", docUploadPath);
    }
    fileData.append("caseNumber", caseId);
    fileData.append("docType", documentType);
    fileData.append("docName", documentName);

    fileUpDownAxios
      .post("/downloadFile", fileData, { responseType: "blob" })
      .then((response) => {
        const docName = documentName;
        const filename = `${documentType}_${caseId}${docName.substring(
          docName.lastIndexOf(".")
        )}`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const lastIndex = docName.lastIndexOf(".");
        const fileType = docName.slice(lastIndex + 1);
        if (restrictedFileTypes.includes(fileType)) {
          Swal.fire({
            icon: "error",
            title: "This FileType Is Not Visible In The Browser",
          });
          return;
        }

        setDocViewDialog({
          ...docViewDialog,
          open: true,
          fileName: filename,
          fileType: fileType,
          url: url,
        });
      })
      .catch((err) => {
        printConsole("Caught in download file: ", err);
        alert("Failed to download File");
      });
  };

  ////

  const decisonRef = React.createRef();
  const decisonReasonRef = useRef();

  const [decisionState, setDecisionState] = useState({ decisionNotes: "" });

  const handleSelectChange = (selectedValue, evnt) => {
    const { name } = evnt;
    if (name === "decision") {
      prop.state.decision = selectedValue?.value;
      decisonReasonRef.current.clearValue();

    }
    if (prop.state.formNames === 'Appeals') {


      if (selectedValue?.value) {
        if (decisionReasonArray[stageName]) {
          setReasonSelectValues([...decisionReasonArray[stageName][selectedValue?.value]]);
        } else {
          setReasonSelectValues([])
        }

      }
    }
    setDecisionState({ ...decisionState, [name]: selectedValue });


  };


  const handleSelectChangeReason = (selectedValue, evnt) => {
    const { name } = evnt;
    if (name === "decisionReason") {
      prop.state.decisionReason = selectedValue?.value;
      
    }
  };

  const handleLinearFieldChange = (evt) => {
    console.log("decisionNotes-->")
    const value = evt.target.value;
    if (evt.target.name === "decisionNotes") {
      console.log("evt.target.name--->",evt.target.name)
      prop.state.decisionNotes = convertToCase(evt.target.value);
    }
    setDecisionState({
      ...decisionState,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleModalShowHide = (index, flagValue, requestedFrom) => {
    if (requestedFrom === "Close") {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }

    let newArray = [...documentData];
    newArray = convertArrayToOuterArray(newArray);
    let documentName =
      newArray[index]["documentType"] === undefined
        ? ""
        : newArray[index]["documentType"].value;
    if (documentName === "") {
      alert("Please select Document Name first");
      selectRef.current.focus();
    } else {
      let docIndexJson = { ...docClickedIndex.current };
      docIndexJson.FileUpload = index;
      docClickedIndex.current = docIndexJson;

      setModalShow({ ...modalShow, FileUpload: flagValue });
    }
  };

  const handleFileUpload = (evnt, index) => {
    if (evnt.target.files[0] === undefined) {
      setFileState([...fileState, { selectedFile: null, fileIndex: index }]);
    }

    if (evnt.target.files[0] !== undefined) {
      if (
        documentData[index].documentType === "Draft Contract" ||
        documentData[index].documentType === "Final Contract"
      ) {
        const fileExt = evnt.target.files[0].name.split(".").pop();
        if (fileExt !== "docx" && fileExt !== "doc") {
          alert("Only docx or doc file type supported.");
          evnt.target.value = null;
          return;
        }
      }
      setFileState([
        ...fileState,
        { selectedFile: evnt.target.files[0], fileIndex: index },
      ]);
    }
  };

  const uploadFile = async (arr, index) => {
    try {
      let paramData = [...arr];
      paramData = convertArrayToOuterArray(paramData);
      let selectedFile = null;
      fileState.forEach((el) => {
        if (el.fileIndex === index) {
          selectedFile = el.selectedFile;
        }
      });

      if (selectedFile !== null) {
        const fileData = new FormData();
        const caseId
          = Number(prop.state.caseNumber);
        const documentType = paramData[index].documentType;
        fileData.append("file", selectedFile);
        fileData.append("caseNumber", caseId);
        fileData.append("docType", documentType);
        fileData.append("source", "Manual");

        const res = await fileUpDownAxios.post("/uploadFile", fileData);
        console.log("API response for Upload file: ", res);

        if (res.status === 200) {
          paramData.splice(index, 1);
          alert("File uploaded successfully!");
          docFunction();
          setFileState([]);
          handleModalShowHide(index, false);
        }
      } else {
        alert("Please first select a document to upload.");
      }
    } catch (exception) {
      console.error("Error during file upload: ", exception);
      alert("An error occurred while uploading the file. Please try again later.");
    }
  };

  // decision dropdown
  let decisionOptions = [];

  const mastersSelector = useSelector((masters) => masters);

  const [documentData, setDocumentData] = useState([]);

  const deleteTableRows = (index) => {
    setFileState([]);

    let diff = documentData.length - index;
    index = index + diff - 1;
    const tempRows = [...documentData];
    tempRows.splice(index, 1);
    setDocumentData(tempRows);
  };

  const addTableRows = () => {
    const rowsInput = {};
    rowsInput.rowNumber = documentData.length + 1;
    setDocumentData([...documentData, rowsInput]);
  };

  // using generic api for populating already uploaded documents from Prov_CaseDocuments
  const docFunction = () => {
    let getDocJson = {};
    getDocJson["tableNames"] = getTableDetails()["caseDocumentsTable"];
    getDocJson["whereClause"] = { caseNumber: prop.state.caseNumber };
    customAxios
      .post("/generic/get", getDocJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.Status === 0) {
          const respData = [...res.data.data.caseDocumentsTable];

          let newArray = [];
          respData.forEach((js) => {
            const newDocJson = convertToDateObj(js);
            newArray.push(newDocJson);
          });

          setDocumentData(newArray);
        }
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };

  const handleGridSelectChange = (
    index,
    selectedValue,
    documentName,
    docArr
  ) => {
    let rowsInput = "";
    const { name } = documentName;
    rowsInput = [...docArr];
    rowsInput[index][name] = selectedValue.value;

    setDocumentData(rowsInput);
  };

  useEffect(() => {
    disableAllElements(prop, "Dashboard");
  });

  const getDelegatedValue = (delegatedVal) => {
    if (delegatedVal !== undefined) {
      if (delegatedVal.hasOwnProperty("value")) {
        return delegatedVal.value.toLowerCase();
      } else {
        return delegatedVal.toLowerCase();
      }
    } else {
      return "";
    }
  };

  useEffect(() => {
    const flowId = Number(prop.state.flowId);

    setFlowId(flowId);

    let selectJson = {};

    let documentJson = {};

    getContractEsignData();

    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["decisionTable"];
    getApiJson["whereClause"] = {
      caseId: prop.state.caseNumber,
      flowId: prop.state.flowId,
    };
    getApiJson["constraints"] = { "order~By": "SNO ASC" };
    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.Status === 0) {
          const respData = [...res.data.data.decisionTable];
          let newArr = [];
          respData.forEach((js) => {
            const newJson = convertToDateObj(js);
            newArr.push(newJson);
          });
          setDecisionHistory(newArr);
          //setDecisionHistory(respData);
        }
      })
      .catch((err) => {
        // console.log(err.message);
      });

    //calling for Prov_CaseDocuments
    docFunction();
  }, []);

  useEffect(() => {
    let selectJson = {};
    let mappedObject = {};
    const stageName = String(prop.state.stageName);
    const transactionType = String(prop.state.formNames);
    const flowId = Number(prop.state.flowId);
    if (decisonRef.current !== null && tabInput?.buttonClicked !== "callProc") {
      decisonRef.current.clearValue();
    }

    //Decison Dropdown
    if (mastersSelector.hasOwnProperty("masterDecision")) {
      const delegateParsedVal = getDelegatedValue(tabInput?.delegatedVal);

      if (
        (transactionType == "Provider Modification" ||
          transactionType == "Ancillary/Facility Modification" ||
          transactionType == "Termination" ||
          delegateParsedVal === "yes" ||
          delegateParsedVal === "y") &&
        stageName == "QA"
      ) {
        decisionOptions.push(
          { label: "Submit", value: "Submit" },
          { label: "Discard", value: "Discard" }
        );
      } else {
        console.log("logger descision : ", mastersSelector["masterDecision"])
        selectJson.decisionOptions =
          mastersSelector["masterDecision"].length === 0
            ? []
            : mastersSelector["masterDecision"][0];

        selectJson["decisionOptions"]
          .filter(
            (data) => data.WORKSTEP.trim() == stageName.trim()
          ).map((val) => {
            const existingIndex = decisionOptions.findIndex((item) => item.value === val.DECISION);

            if (existingIndex === -1) {
              decisionOptions.push({
                value: val.DECISION,
                label: val.DECISION
              });
            }
          }
          );

        selectJson["decisionOptions"]
          .filter(
            (data) => data.WORKSTEP.trim() == stageName.trim()
          ).map((val) => {
            let stageName = val.WORKSTEP;
            let decision = val.DECISION;
            let decisionReason = val.DECISION_REASON;
            if (!mappedObject[stageName]) {
              mappedObject[stageName] = {};
            }
            if (!mappedObject[stageName][decision]) {
              mappedObject[stageName][decision] = [];
            }
            mappedObject[stageName][decision].push({
              value: decisionReason,
              label: decisionReason
            });
          }
          );
      }
    }
    console.log("decision options", decisionOptions);
    console.log("mapped object", mappedObject);

    setTimeout(() => {
      setSelectValues(decisionOptions);
      setDecisionReasonArray(mappedObject);
      console.log("logger selectValues ", selectValues);
    }, 1000);
  }, [tabInput]);

  const openDecisionModal = (index) => {
    let docIndexJson = { ...docClickedIndex.current };
    docIndexJson.Decision = index;
    docClickedIndex.current = docIndexJson;
    setModalShow({ ...modalShow, HistoryModal: true });
  };

  const decisionGridData = () => {
    if (decHistoryGrid.length > 0) {
      return decHistoryGrid.map((data, index) => {
        return (
          <tr
            key={index}
            onClick={() => {
              openDecisionModal(index);
            }}
          >
            <td className="tableData">
              {"userName" in data && data.userName.value !== undefined
                ? convertToCase(data.userName.value)
                : convertToCase(data.userName)}
            </td>
            <td className="tableData">
              {"workstepName" in data && data.workstepName.value !== undefined
                ? convertToCase(data.workstepName.value)
                : convertToCase(data.workstepName)}
            </td>
            <td className="tableData">
              {"caseDecision" in data && data.caseDecision.value !== undefined
                ? convertToCase(data.caseDecision.value)
                : convertToCase(data.caseDecision)}
            </td>

            <td className="tableData">
              {"caseDecNotes" in data && data.caseDecNotes.value !== undefined
                ? convertToCase(data.caseDecNotes.value)
                : convertToCase(data.caseDecNotes)}
            </td>
            <td className="tableData">
              {"entryDateTime" in data && data.entryDateTime.value !== undefined
                ? formatDecHistDate(data.entryDateTime.value)
                : formatDecHistDate(data.entryDateTime)}
            </td>
            <td className="tableData">
              {"exitDateTime" in data && data.exitDateTime.value !== undefined
                ? formatDecHistDate(data.exitDateTime.value)
                : formatDecHistDate(data.exitDateTime)}
            </td>
          </tr>
        );
      });
    }
  };

  const formatDecHistDate = (dateObj) => {
    if (dateObj) {
      if (typeof dateObj === "string") {
        const localDate = new Date(Date.parse(dateObj));

        dateObj = localDate;
      } else if (typeof dateObj === "number") {
        const localDate2 = new Date(dateObj);

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
      let hrs = dateObj.getHours();
      let mins = dateObj.getMinutes();
      let secs = dateObj.getSeconds();
      let formattedDate =
        mm + "/" + dd + "/" + yyyy + " " + hrs + ":" + mins + ":" + secs;
      return formattedDate;
    }
    return null;
  };

  const getContractEsignData = () => {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["esignTable"];
    getApiJson["whereClause"] = { CaseNumber: prop.state.caseNumber };
    getApiJson["constraints"] = { "order~By": "ActionDateTime ASC" };
    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.Status === 0) {
          const respData = [...res.data.data.esignTable];
          let newArr = [];
          respData.forEach((js) => {
            const newJson = convertToDateObj(js);
            newArr.push(newJson);
          });
          setContGridData(newArr);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const [contGridData, setContGridData] = useState([]);

  const contractData = () => {
    return (
      <>
        <table class="table table-bordered tableLayout">
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              <th scope="col">Operation</th>
              <th scope="col">Action Date Time</th>
              <th scope="col">Status</th>
              <th scope="col">Comments</th>
            </tr>
          </thead>
          <tbody>{contractGridData()}</tbody>
        </table>
      </>
    );
  };

  const contractGridData = () => {
    if (contGridData.length > 0) {
      return contGridData.map((data, index) => {
        return (
          <tr key={index}>
            <td className="tableData">
              {"EsignOperation" in data
                ? convertToCase(data.EsignOperation)
                : ""}
            </td>
            <td className="tableData">
              {"ActionDateTime" in data
                ? formatDecHistDate(data.ActionDateTime)
                : ""}
            </td>
            <td className="tableData">
              {"DocStatus" in data ? convertToCase(data.DocStatus) : ""}
            </td>

            <td className="tableData">
              {"Comments" in data ? convertToCase(data.Comments) : ""}
            </td>
          </tr>
        );
      });
    }
  };

  const decsHistoryData = () => {
    return (
      <>
        <table class="table table-bordered tableLayout">
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              <th scope="col">User Name</th>
              <th scope="col">Workstep Name</th>
              <th scope="col">Case Decision</th>
              <th scope="col">Case Decision Notes</th>
              <th scope="col">Entry Date Time</th>
              <th scope="col">Exit Date Time</th>
            </tr>
          </thead>
          <tbody>{decisionGridData()}</tbody>
        </table>
      </>
    );
  };

  function getDate() {
    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth() + 1;
    var year = todaydate.getFullYear();
    var datestring = month + "/" + day + "/" + year;

    return datestring;
  }

  //Commented by Harshit on 06/10/2023 as it is a redundant code.

  const callESignOperationApi = (esignOption) => {
    let esignApiJson = {
      caseNumber: Number(prop.state.caseNumber),
      transType: prop.state.formNames,
      condition1: prop.state.contractType,
      condition2: "Condition2",
      condition3: prop.state.formNames,
      option: esignOption,
    };
    if (
      prop.state.contractType === "" ||
      prop.state.contractType === undefined
    ) {
      alert("Please select Contract Type first under Provider Contracting Tab");
    } else {
      setShowLoader(true);
      esignAxios.post("/esignOperations", esignApiJson).then((res) => {
        setShowLoader(false);
        const result = res.data.split("~");
        alert(result[0]);
        if (esignOption !== "Document ESign") {
          docFunction();
        }
        getContractEsignData();
      });
    }
  };
  const reviewData = () => {
    if (tabInput.potentialDupData != undefined) {
      if (tabInput.potentialDupData.length > 0) {
        return tabInput.potentialDupData.map((data, index) => {
          return (
            <>
              <tr key={index}>
                {tabInput.lockStatus !== "Y" && (
                  <>
                    <td>{index + 1}</td>
                  </>
                )}
                {/* <td className='tableData'> */}

                <td>
                  {"dupCaseId" in data && data.dupCaseId.value !== undefined
                    ? data.dupCaseId.value
                    : data.dupCaseId}
                </td>
                <td>
                  {"contractId" in data && data.contractId.value !== undefined
                    ? data.contractId.value
                    : data.contractId}
                </td>
                {prop.state.stageName == "Network" ? (
                  <td>
                    {"entityName" in data && data.entityName.value !== undefined
                      ? data.entityName.value
                      : data.entityName}
                  </td>
                ) : (
                  <td>
                    {"organizationName" in data &&
                      data.organizationName.value !== undefined
                      ? data.organizationName.value
                      : data.organizationName}
                  </td>
                )}

                <td>
                  {"createdDateTime" in data &&
                    data.createdDateTime.value !== undefined
                    ? formatDecHistDate(data.createdDateTime.value)
                    : formatDecHistDate(data.createdDateTime)}
                </td>
                <td>
                  {"stageName" in data && data.stageName.value !== undefined
                    ? data.stageName.value
                    : data.stageName}
                </td>

                <td>
                  {data?.actionType == undefined ? (
                    <Typography>
                      {data?.action ? data?.action?.value : ""}
                    </Typography>
                  ) : (
                    data.actionType
                  )}
                </td>
              </tr>
            </>
          );
        });
      }
    }
  };

  const showVersion = (index) => {
    let docIndexJson = { ...docClickedIndex.current };
    docIndexJson.Version = index;
    docClickedIndex.current = docIndexJson;
    setModalShow({ ...modalShow, Version: true });
  };

  //Added by Harshit wrt document versions.
  const convertArrayToOuterArray = (arr) => {
    let newArray = [...arr];
    newArray.sort((a, b) =>
      a.uploadedDateTime < b.uploadedDateTime
        ? 1
        : b.uploadedDateTime < a.uploadedDateTime
          ? -1
          : 0
    );
    //filtering results by documentType and fetching result of each documentType

    const unique = newArray.filter((obj, index) => {
      if (obj.documentType !== "Other Documents") {
        return (
          index ===
          newArray.findIndex((o) => obj.documentType === o.documentType)
        );
      } else {
        return obj;
      }
    });
    return unique;
  };
  //Till Here

  //Added by Harshit for Removing document type already uploaded apart from other documents
  const getNotUploadedDocTypes = (docArr) => {
    let selectJson = {};
    let documentNames = [];
    // if (mastersSelector.hasOwnProperty("masterDocumentName")) {
    //   let documentNameOptions =
    //     mastersSelector["masterDocumentName"].length === 0
    //       ? []
    //       : mastersSelector["masterDocumentName"][0];
    //   documentNameOptions
    //     .filter((data) => data.FlowId == flowId)
    //     .map((val) =>
    //       documentNames.push({ value: val.DocumentName, label: val.DocumentName })
    //     );
    // }
    // if (documentNames.length > 0 && docArr.length > 0) {
    //   docArr.forEach((obj) => {
    //     if (obj.documentType !== "Other Documents") {
    //       const requiredIndex = documentNames.findIndex((el) => {
    //         return el.value === obj.documentType;
    //       });

    //       if (requiredIndex !== -1) {
    //         documentNames.splice(requiredIndex, 1);
    //       }
    //     }
    //   });
    // }

    selectJson.docOptions =
      mastersSelector["masterAngDocument"].length === 0
        ? []
        : mastersSelector["masterAngDocument"][0];

    selectJson["docOptions"]
      .filter(
        (data) => data.WORKSTEP_NAME.trim() == stageName.trim()
      ).map((val) => {
        documentNames.push({
          value: val.DOCUMENT_NAME,
          label: val.DOCUMENT_NAME
        });
      }
      );

    return documentNames;
  };

  const documentsData = () => {
    if (documentData.length > 0) {
      let unique = [...documentData];

      unique = convertArrayToOuterArray(unique);
      let documentNameValue = getNotUploadedDocTypes(unique);
      console.log("doc name value", documentNameValue);

      //Till Here

      return unique.map((data, index) => {
        return (
          <>
            <tr key={index}>
              {tabInput.lockStatus !== "Y" && (
                <>
                  <td>
                    {data.sno == undefined ? (
                      <button
                        className="deleteBtn"
                        style={{ textAlign: "center" }}
                        onClick={() => {
                          deleteTableRows(index);
                        }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    ) : (
                      index + 1
                    )}
                  </td>
                </>
              )}

              <td className="tableData">
                {data.documentType == undefined ? (
                  <Select
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        fontWeight: "lighter",
                      }),
                      singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
                    }}
                    // value={(('documentType' in data) && (data.documentType.value !== undefined)) ? (convertToCase(data.documentType.value)) : (convertToCase(data.documentType))}
                    //value={data.documentType}
                    //options={documentNames}
                    ref={selectRef}
                    options={documentNameValue}
                    isClearable
                    onChange={(selectValue, event) =>
                      handleGridSelectChange(index, selectValue, event, unique)
                    }
                    name="documentType"
                    id="documentType"
                  />
                ) : (
                  data.documentType
                )}
              </td>
              <td>{data.documentName}</td>
              <td>{data.sno === undefined ? "Manual" : data.source}</td>
              <td>
                {data.documentType !== undefined &&
                  data.documentType === "Other Documents" &&
                  data.documentName !== undefined ? (
                  ""
                ) : (
                  <img
                    id="w9DocUploadImage"
                    src={documentUploadImage}
                    className="img-fluid disableElements"
                    alt="..."
                    style={{ height: "30px", background: "inherit" }}
                    onClick={() => handleModalShowHide(index, true)}
                  ></img>
                )}
              </td>
              <td>
                <img
                  id="w9DocDownloadImage"
                  src={documentDownloadImage}
                  className="img-fluid"
                  alt="..."
                  style={{ height: "30px", background: "inherit" }}
                  onClick={() => downloadFile(index, unique)}
                ></img>
              </td>
              <td>
                {/* {data.uploadedDateTime===undefined?
                        <Select
                        options={statusInfo}
                        name="statusDropdown"
                        id="statusDropdown"/>:'Uploaded'} */}
                {data.uploadedDateTime === undefined ? "Pending" : "Uploaded"}
              </td>

              <td>
                {data.documentType !== "Other Documents" ? (
                  <img
                    id="viewDocImage"
                    src={viewDocumentImage}
                    className="img-fluid"
                    alt="..."
                    style={{ height: "30px", background: "inherit" }}
                    onClick={() => showVersion(index)}
                  ></img>
                ) : (
                  ""
                )}
              </td>

              <td>
                <i
                  className="fa fa-eye"
                  style={{
                    height: "30px",
                    background: "inherit",
                    fontSize: "20px",
                    alignContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    downloadedfileBlob(index, unique);
                  }}
                ></i>
              </td>
            </tr>
          </>
        );
      });
    }
  };

  return (
    <>
      <Modal
        show={showLoader}
        onHide={() => { }}
        backdrop="static"
        keyboard={false}
        size="sm"
        dialogClassName="modal-dialog loader-dialog"
        centered
      >
        <BeatLoader loading={true} size={50} cssOverride={override} />
      </Modal>
      <div className="DecisionTab">
        <div className="Container">
          <div
            className="accordion AddProviderLabel"
            id="accordionPanelsStayOpenExample"
          >
            {
              // (flowId == 1 &&
              prop.state.stageName !== undefined &&
                (prop.state.stageName == "Network" ||
                  prop.state.stageName == "Cred Specialist") ? (
                <div className="accordion-item disableElements">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingReview"
                  >
                    <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseReview"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseDocument"
                    >
                      Review
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseReview"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingReview"
                  >
                    <div className="accordion-body">
                      <table
                        class="table table-bordered tableLayout"
                        style={{ textAlign: "center" }}
                      >
                        <thead>
                          <tr className="tableRowStyle tableHeaderColor">
                            <th style={{ width: "8%" }} scope="col">
                              S. No.
                            </th>
                            <th style={{ width: "10%" }} scope="col">
                              {" "}
                              Duplicate Case ID
                            </th>
                            <th style={{ width: "10%" }} scope="col">
                              Contract ID
                            </th>

                            {prop.state.formNames.toLowerCase() ===
                              "add a provider" ||
                              prop.state.formNames.toLowerCase() ===
                              "add a provider" ? (
                              <th style={{ width: "19%" }} scope="col">
                                Legal Entity Name
                              </th>
                            ) : (
                              ""
                            )}
                            {prop.state.formNames.toLowerCase() ===
                              "provider contracting" ||
                              prop.state.formNames.toLowerCase() ===
                              "facility/ancillary/health systems contracting" ? (
                              <th style={{ width: "19%" }} scope="col">
                                Legal Entity Name
                              </th>
                            ) : (
                              ""
                            )}
                            {prop.state.formNames.toLowerCase() ===
                              "add a facility" ||
                              prop.state.formNames.toLowerCase() ===
                              "add an ancillary" ? (
                              <th style={{ width: "19%" }} scope="col">
                                DBA Name
                              </th>
                            ) : (
                              ""
                            )}
                            {prop.state.formNames.toLowerCase() ===
                              "appeals" ||
                              prop.state.formNames.toLowerCase() ===
                              "appeals" ? (
                              <th style={{ width: "19%" }} scope="col">
                                DBA Name
                              </th>
                            ) : (
                              ""
                            )}
                            <th style={{ width: "19%" }} scope="col">
                              Created Date Time
                            </th>
                            <th style={{ width: "15%" }} scope="col">
                              Stage Name
                            </th>
                            <th style={{ width: "19%" }} scope="col">
                              <FormControl>
                                <RadioGroup
                                  value={
                                    tabInput?.potentialDupData?.length > 0 &&
                                    tabInput?.potentialDupData[0]?.action?.value
                                  }
                                >
                                  <FormControlLabel
                                    sx={{ marginTop: -1 }}
                                    value="Not Duplicate"
                                    control={
                                      <Radio
                                        size="small"
                                        onClick={(event) =>
                                          tabInput.handleActionSelectChange(
                                            event.target?.name,
                                            event?.target?.value
                                          )
                                        }
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        Not Duplicate
                                      </Typography>
                                    }
                                    name="action"
                                  />
                                  <FormControlLabel
                                    sx={{ marginTop: -2 }}
                                    value="Potential Duplicate"
                                    control={
                                      <Radio
                                        size="small"
                                        onClick={(event) =>
                                          tabInput.handleActionSelectChange(
                                            event?.target?.name,
                                            event?.target?.value
                                          )
                                        }
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                        noWrap
                                      >
                                        Potential Duplicate
                                      </Typography>
                                    }
                                    name="action"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </th>
                          </tr>
                        </thead>
                        <tbody>{reviewData()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div />
              )
            }

            {flowId == 1 &&
              prop.state.stageName !== undefined &&
              prop.state.stageName !== "Pending Provider" ? (
              <div className="accordion-item disableElements">
                <h2
                  className="accordion-header"
                  id="panelsStayOpen-headingContract"
                >
                  <button
                    className="accordion-button accordionButtonStyle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseContract"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseContract"
                  >
                    Contract
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseContract"
                  className="accordion-collapse collapse show"
                  aria-labelledby="panelsStayOpen-headingContract"
                >
                  <div className="accordion-body">
                    {flowId == 1 &&
                      prop.state.stageName !== undefined &&
                      prop.state.stageName === "Network" ? (
                      <div className="row my-2">
                        <div className="col-sm mx-1">
                          <button
                            style={{ width: "60%" }}
                            type="button"
                            className="btn btn-outline-primary btnStyle"
                            onClick={() =>
                              callESignOperationApi("Generate Document")
                            }
                          >
                            Contract Selection
                          </button>
                        </div>
                        <div className="col-sm mx-1">
                          <button
                            style={{ width: "60%" }}
                            type="button"
                            className="btn btn-outline-primary btnStyle"
                            onClick={() =>
                              callESignOperationApi("Final Contract")
                            }
                          >
                            Final Contract
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                    {flowId == 1 &&
                      prop.state.stageName !== undefined &&
                      prop.state.stageName !== "Network" ? (
                      <div>
                        <div className="row my-2">
                          {/* <div className="col-sm mx-1">
                                            <button style={{width:"80%"}} type="button"className="btn btn-outline-primary btnStyle"
                                            onClick={()=>callESignOperationApi('Generate Document')}>Contract Selection</button>
                                            </div> */}
                          {/* <div className="col-sm mx-1">
                                            <button style={{width:"80%"}} type="button" className="btn btn-outline-primary btnStyle"
                                            onClick={()=>callESignOperationApi('Final Contract')}>Final Contract</button>
                                            </div> */}
                          <div className="col-sm mx-1">
                            <button
                              style={{ width: "80%" }}
                              type="button"
                              className="btn btn-outline-primary btnStyle"
                              onClick={() =>
                                callESignOperationApi("Document ESign")
                              }
                            >
                              E-Sign
                            </button>
                          </div>
                          <div className="col-sm mx-1">
                            <button
                              style={{ width: "80%" }}
                              type="button"
                              className="btn btn-outline-primary btnStyle"
                              onClick={() =>
                                callESignOperationApi("Check Status")
                              }
                            >
                              Doc Status
                            </button>
                          </div>
                          <div className="col-sm mx-1">
                            <button
                              style={{ width: "80%" }}
                              type="button"
                              className="btn btn-outline-primary btnStyle"
                            >
                              Send Reminder
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="row my-2">
                      <div className="col-xs-6 col-md-12">{contractData()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div />
            )}

            <div className="accordion-item disableElements">
              <h2 className="accordion-header" id="panelsStayOpen-headingNotes">
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseNotes"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseNotes"
                >
                  Notes
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseNotes"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingNotes"
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-xs-12 col-md-4">
                      <label>Decision</label>
                      <Select
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            fontWeight: "lighter",
                            backgroundColor: changeColorOfSelect(prop, "PDM")
                              ? "#F0F0F0"
                              : "",
                          }),
                        }}
                        //value={selectJson['decisionOptions'][0]}
                        onChange={(selectValue, event) =>
                          handleSelectChange(selectValue, event)
                        }
                        options={selectValues}
                        ref={decisonRef}
                        // isDisabled={(tabInput.lockStatus==='Y')?true:false}
                        name="decision"
                        id="decisionDropdown"
                      />
                    </div>

                    {/* descision reason */}
                    {
                      prop.state.formNames == "Appeals" && <div className="col-xs-12 col-md-4">
                        <label>Decision Reason</label>
                        <Select
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              fontWeight: "lighter",
                              backgroundColor: changeColorOfSelect(prop, "PDM")
                                ? "#F0F0F0"
                                : "",
                            }),
                          }}
                          //value={selectJson['decisionOptions'][0]}
                          onChange={(selectValue, event) =>
                            handleSelectChangeReason(selectValue, event)
                          }
                          options={selectReasonValues}

                          // isDisabled={(tabInput.lockStatus==='Y')?true:false}
                          name="decisionReason"
                          ref={decisonReasonRef}
                          id="decisionReasonDropdown"
                        />
                      </div>
                    }


                    <div className="col-xs-12 col-md-4">
                      <label>Decision Date</label>
                      <input
                        type="text"
                        value={getDate()}
                        name="decisionDateDesc"
                        id="decisionDate"
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="row my-2">
                    <div className="col-xs-12">
                      <label>Case Notes:</label>
                      <textarea
                        onChange={handleLinearFieldChange}
                        value={
                          "decisionNotes" in decisionState &&
                            decisionState.decisionNotes?.value !== undefined
                            ? convertToCase(decisionState?.decisionNotes?.value)
                            : convertToCase(decisionState?.decisionNotes)
                        }
                        style={{ width: "100%" }}
                        name="decisionNotes"
                      // disabled={(tabInput.lockStatus==='Y')?true:false}
                      />
                    </div>
                  </div>

                  {/* <div className="row my-2">
                        <div className="col-xs-12">
                        <button type="button" className="btn btn-outline-primary btnStyle">Save Only Office Changes</button>
                        </div>
                        </div> */}
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="panelsStayOpen-headingDocuments"
              >
                <button
                  className="accordion-button accordionButtonStyle disableElements"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseDocuments"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseDocument"
                >
                  Documents
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseDocuments"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingDocuments"
              >
                <div className="accordion-body">
                  <table
                    class="table table-bordered tableLayout"
                    style={{ textAlign: "center" }}
                  >
                    <thead>
                      <tr className="tableRowStyle tableHeaderColor">
                        {tabInput.lockStatus !== "Y" && (
                          <th style={{ width: "6%" }}>
                            <button
                              className="addBtn"
                              onClick={() => {
                                addTableRows();
                              }}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </th>
                        )}

                        <th style={{ width: "20%" }} scope="col">
                          Document Name
                        </th>
                        <th scope="col">Uploaded FileName</th>
                        <th style={{ width: "10%" }} scope="col">
                          Source
                        </th>
                        <th style={{ width: "10%" }} scope="col">
                          Upload
                        </th>
                        <th style={{ width: "10%" }} scope="col">
                          Download
                        </th>
                        <th style={{ width: "10%" }} scope="col">
                          Status
                        </th>
                        <th style={{ width: "10%" }} scope="col">
                          Versions
                        </th>
                        <th style={{ width: "10%" }} scope="col">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>{documentsData()}</tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2
                className="accordion-header"
                id="panelsStayOpen-headingDecHistory"
              >
                <button
                  className="accordion-button accordionButtonStyle disableElements"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseDecHistory"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseDecHistory"
                >
                  Decision History
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseDecHistory"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingDecHistory"
              >
                <div className="accordion-body">
                  <div className="row my-2">
                    <div className="col-xs-6 col-md-12">
                      {decsHistoryData()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modalShow.FileUpload && (
          <FileUpload
            modalShow={modalShow.FileUpload}
            handleModalShowHide={handleModalShowHide}
            handleFileUpload={handleFileUpload}
            uploadFile={uploadFile}
            currIndex={docClickedIndex.current.FileUpload}
            documentData={documentData}
          />
        )}

        {modalShow.Version && (
          <DocumentVersion
            modalShow={modalShow}
            docData={documentData}
            clickedIndex={docClickedIndex.current.Version}
            setModalShow={setModalShow}
            convertArrayToOuterArray={convertArrayToOuterArray}
          >
            {" "}
          </DocumentVersion>
        )}

        {modalShow.HistoryModal && (
          <DecisionHistoryModal
            modalShow={modalShow}
            setModalShow={setModalShow}
            decisionGrid={decHistoryGrid}
            clickedIndex={docClickedIndex.current.Decision}
            formatDecHistDate={formatDecHistDate}
          ></DecisionHistoryModal>
        )}
        {docViewDialog.open && (
          <DocumentViewer
            open={docViewDialog}
            close={() =>
              setDocViewDialog({ ...docViewDialog, open: false, url: "" })
            }
            dialogViewData={docViewDialog}
          />
        )}
      </div>
    </>
  );
}
