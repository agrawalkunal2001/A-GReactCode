import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./ClaimInformationTable.css";

export default function ClaimInformationTable({
    claimInformationGridData,
    formGridData,
    deleteTableRows,
    handleGridSelectChange,
    addTableRows,
    handleGridDateChange,
    handleGridFieldChange,
    gridRowsFinalSubmit,
    selectJson,
    lockStatus,
    editTableRows,
    gridFieldTempState,
}) {

    ClaimInformationTable.displayName = "ClaimInformationTable";

    const [dataIndex, setDataIndex] = useState();

    const [operationValue, setOperationValue] = useState("");

    const [modalShow, setModalShow] = useState(false);

    const [isTouched, setIsTouched] = useState({});

    const { getGridJson, convertToCase } = useGetDBTables();

    let lineNumberOptions = [];

    const tdDataReplica = (index) => {
        console.log("Inside tdDataReplica");
        const data = getGridJson(gridFieldTempState);
        console.log("data", data);

        // selectJson["lineNumberOptions"].map((val) =>
        //     lineNumberOptions.push({ value: val, label: val })
        // );

        return (
            <>
                <div className="Container AddProviderLabel AddModalLabel">
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Issue Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Issue_Number" in data && data.Issue_Number.value !== undefined
                                        ? convertToCase(data.Issue_Number.value)
                                        : convertToCase(data.Issue_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Issue_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Line Number</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Line_Number}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={lineNumberOptions}
                                name="Line_Number"
                                id="lineNumberDropDown"
                                isDisabled={lockStatus == "V"}
                                isClearable
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Patient Ref / Account Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Patient_Ref_Account_Number" in data && data.Patient_Ref_Account_Number.value !== undefined
                                        ? convertToCase(data.Patient_Ref_Account_Number.value)
                                        : convertToCase(data.Patient_Ref_Account_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Patient_Ref_Account_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Place of Service (POS)
                            </label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Place_of_Service_POS" in data && data.Place_of_Service_POS.value !== undefined
                                        ? convertToCase(data.Place_of_Service_POS.value)
                                        : convertToCase(data.Place_of_Service_POS)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Place_of_Service_POS"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Procedure / Diagnosis Code 2</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Procedure_Diagnosis_Code_2" in data && data.Procedure_Diagnosis_Code_2.value !== undefined
                                        ? convertToCase(data.Procedure_Diagnosis_Code_2.value)
                                        : convertToCase(data.Procedure_Diagnosis_Code_2)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Procedure_Diagnosis_Code_2"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Procedure / Diagnosis Code(s)</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Procedure_Diagnosis_Codes" in data && data.Procedure_Diagnosis_Codes.value !== undefined
                                        ? convertToCase(data.Procedure_Diagnosis_Codes.value)
                                        : convertToCase(data.Procedure_Diagnosis_Codes)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Procedure_Diagnosis_Codes"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Provider Account Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Provider_Account_Number" in data && data.Provider_Account_Number.value !== undefined
                                        ? convertToCase(data.Provider_Account_Number.value)
                                        : convertToCase(data.Provider_Account_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Provider_Account_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>DRG Indicator</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "DRG_Indicator" in data && data.DRG_Indicator.value !== undefined
                                        ? convertToCase(data.DRG_Indicator.value)
                                        : convertToCase(data.DRG_Indicator)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="DRG_Indicator"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Payment Method</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Payment_Method" in data && data.Payment_Method.value !== undefined
                                        ? convertToCase(data.Payment_Method.value)
                                        : convertToCase(data.Payment_Method)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Payment_Method"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Payment Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Payment_Number" in data && data.Payment_Number.value !== undefined
                                        ? convertToCase(data.Payment_Number.value)
                                        : convertToCase(data.Payment_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Payment_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Filed Timely</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Filed_Timely}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={lineNumberOptions}
                                name="Filed_Timely"
                                id="lineNumberDropDown"
                                isDisabled={lockStatus == "V"}
                                isClearable
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Grant Good Cause</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Grant_Good_Cause}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={lineNumberOptions}
                                name="Grant_Good_Cause"
                                id="lineNumberDropDown"
                                isDisabled={lockStatus == "V"}
                                isClearable
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Good Cause Reason</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Good_Cause_Reason}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={lineNumberOptions}
                                name="Good_Cause_Reason"
                                id="lineNumberDropDown"
                                isDisabled={lockStatus == "V"}
                                isClearable
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Auth Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Auth_Number" in data && data.Auth_Number.value !== undefined
                                        ? convertToCase(data.Auth_Number.value)
                                        : convertToCase(data.Auth_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Auth_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Number of Days in Span</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Number_of_Days_in_Span" in data &&
                                            data.Number_of_Days_in_Span.value !== undefined
                                            ? data.Number_of_Days_in_Span.value
                                            : data.Number_of_Days_in_Span
                                    }
                                    name="Number_of_Days_in_Span"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Number_of_Days_in_Span",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Service Start Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Service_Start_Date" in data &&
                                            data.Service_Start_Date.value !== undefined
                                            ? data.Service_Start_Date.value
                                            : data.Service_Start_Date
                                    }
                                    name="Service_Start_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Service_Start_Date",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Service End Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Service_End_Date" in data &&
                                            data.Service_End_Date.value !== undefined
                                            ? data.Service_End_Date.value
                                            : data.Service_End_Date
                                    }
                                    name="Service_End_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Service_End_Date",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Claim Status</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Claim_Status" in data &&
                                            data.Claim_Status.value !== undefined
                                            ? data.Claim_Status.value
                                            : data.Claim_Status
                                    }
                                    name="Claim_Status"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Claim_Status",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Claim Adjusted Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Claim_Adjusted_Date" in data &&
                                            data.Claim_Adjusted_Date.value !== undefined
                                            ? data.Claim_Adjusted_Date.value
                                            : data.Claim_Adjusted_Date
                                    }
                                    name="Claim_Adjusted_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Claim_Adjusted_Date",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Payment Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Payment_Date" in data &&
                                            data.Payment_Date.value !== undefined
                                            ? data.Payment_Date.value
                                            : data.Payment_Date
                                    }
                                    name="Payment_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Payment_Date",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Payment Mail Date (Postmark)</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="example-custom-input-modal"
                                    selected={
                                        "Payment_Mail_Date_Postmark" in data &&
                                            data.Payment_Mail_Date_Postmark.value !== undefined
                                            ? data.Payment_Mail_Date_Postmark.value
                                            : data.Payment_Mail_Date_Postmark
                                    }
                                    name="Payment_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Payment_Mail_Date_Postmark",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={lockStatus == "V"}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Allowed Amount</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Allowed_Amount" in data && data.Allowed_Amount.value !== undefined
                                        ? convertToCase(data.Allowed_Amount.value)
                                        : convertToCase(data.Allowed_Amount)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Allowed_Amount"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Billed Amount</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Billed_Amount" in data && data.Billed_Amount.value !== undefined
                                        ? convertToCase(data.Billed_Amount.value)
                                        : convertToCase(data.Billed_Amount)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Billed_Amount"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
        //}
    };

    const tdData = () => {
        console.log("Inside tdData");
        console.log("claimgrid", formGridData);
        if (
            formGridData["angClaimInformationGrid"] !== undefined) {
            return formGridData["angClaimInformationGrid"].map((data, index) => {
                return (
                    <tr
                        key={index}
                        className={
                            data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
                        }
                    >
                        {lockStatus == "N" && (
                            <>
                                <td>
                                    <span
                                        style={{
                                            display: "flex",
                                        }}
                                    >
                                        <button
                                            className="deleteBtn"
                                            style={{ float: "left" }}
                                            onClick={() => {
                                                deleteTableRows(
                                                    index,
                                                    ClaimInformationTable.displayName,
                                                    "Force Delete"
                                                );
                                                handleOperationValue("Force Delete");
                                                decreaseDataIndex();
                                            }}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                        <button
                                            className="editBtn"
                                            style={{ float: "right" }}
                                            type="button"
                                            onClick={() => {
                                                editTableRows(index, ClaimInformationTable.displayName);
                                                handleModalChange(true);
                                                handleDataIndex(index);
                                                handleOperationValue("Edit");
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                    </span>
                                </td>
                            </>
                        )}
                        {lockStatus == "V" && (
                            <td>
                                <div>
                                    <button
                                        className="editBtn"
                                        style={{ float: "right" }}
                                        type="button"
                                        onClick={() => {
                                            handleModalChange(true);
                                            handleDataIndex(index);
                                            handleOperationValue("Edit");
                                        }}
                                    >
                                        <i className="fa fa-eye"></i>
                                    </button>
                                </div>
                            </td>
                        )}
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Issue_Number"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Line_Number"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Patient_Ref_Account_Number"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Place_of_Service_POS"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Procedure_Diagnosis_Code_2"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Procedure_Diagnosis_Codes"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Provider_Account_Number"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["DRG_Indicator"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Payment_Method"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Payment_Number"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Filed_Timely"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Grant_Good_Cause"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Good_Cause_Reason"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Auth_Number"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Number_of_Days_in_Span"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Service_Start_Date"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Service_End_Date"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Claim_Status"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Claim_Adjusted_Date"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Payment_Date"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formatDate(formGridData["angClaimInformationGrid"][0]["Payment_Mail_Date_Postmark"])
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Allowed_Amount"]
                            }
                        </td>
                        <td className="tableData">
                            {
                                formGridData["angClaimInformationGrid"][0]["Billed_Amount"]
                            }
                        </td>
                    </tr>
                );
            });
        }
        if (
            claimInformationGridData !== undefined &&
            claimInformationGridData.length > 0
        ) {
            return claimInformationGridData.map((data, index) => {
                return (
                    <tr
                        key={index}
                        className={
                            data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
                        }
                    >
                        {lockStatus == "N" && (
                            <>
                                <td>
                                    <span
                                        style={{
                                            display: "flex",
                                        }}
                                    >
                                        <button
                                            className="deleteBtn"
                                            style={{ float: "left" }}
                                            onClick={() => {
                                                deleteTableRows(
                                                    index,
                                                    ClaimInformationTable.displayName,
                                                    "Force Delete"
                                                );
                                                handleOperationValue("Force Delete");
                                                decreaseDataIndex();
                                            }}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                        <button
                                            className="editBtn"
                                            style={{ float: "right" }}
                                            type="button"
                                            onClick={() => {
                                                editTableRows(index, ClaimInformationTable.displayName);
                                                handleModalChange(true);
                                                handleDataIndex(index);
                                                handleOperationValue("Edit");
                                            }}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                    </span>
                                </td>
                            </>
                        )}
                        {lockStatus == "V" && (
                            <td>
                                <div>
                                    <button
                                        className="editBtn"
                                        style={{ float: "right" }}
                                        type="button"
                                        onClick={() => {
                                            handleModalChange(true);
                                            handleDataIndex(index);
                                            handleOperationValue("Edit");
                                        }}
                                    >
                                        <i className="fa fa-eye"></i>
                                    </button>
                                </div>
                            </td>
                        )}

                        <td className="tableData">
                            {
                                "Issue_Number" in data && data.Issue_Number.value !== undefined
                                    ? convertToCase(data.Issue_Number.value)
                                    : convertToCase(data.Issue_Number)
                            }
                        </td>
                        <td className="tableData">
                            {"Line_Number" in data &&
                                data.Line_Number.value !== undefined
                                ? convertToCase(data.Line_Number.value)
                                : convertToCase(data.Line_Number)
                            }
                        </td>
                        <td className="tableData">
                            {"Patient_Ref_Account_Number" in data &&
                                data.Patient_Ref_Account_Number.value !== undefined
                                ? convertToCase(data.Patient_Ref_Account_Number.value)
                                : convertToCase(data.Patient_Ref_Account_Number)}
                        </td>
                        <td className="tableData">
                            {"Place_of_Service_POS" in data &&
                                data.Place_of_Service_POS.value !== undefined
                                ? convertToCase(data.Place_of_Service_POS.value)
                                : convertToCase(data.Place_of_Service_POS)}
                        </td>
                        <td className="tableData">
                            {"Procedure_Diagnosis_Code_2" in data &&
                                data.Procedure_Diagnosis_Code_2.value !== undefined
                                ? formatDate(data.Procedure_Diagnosis_Code_2.value)
                                : formatDate(data.Procedure_Diagnosis_Code_2)}
                        </td>
                        <td className="tableData">
                            {"Procedure_Diagnosis_Codes" in data && data.Procedure_Diagnosis_Codes.value !== undefined
                                ? convertToCase(data.Procedure_Diagnosis_Codes.value)
                                : convertToCase(data.Procedure_Diagnosis_Codes)}
                        </td>
                        <td className="tableData">
                            {"Provider_Account_Number" in data &&
                                data.Provider_Account_Number.value !== undefined
                                ? convertToCase(data.Provider_Account_Number.value)
                                : convertToCase(data.Provider_Account_Number)}
                        </td>
                        <td className="tableData">
                            {"DRG_Indicator" in data &&
                                data.DRG_Indicator.value !== undefined
                                ? convertToCase(data.DRG_Indicator.value)
                                : convertToCase(data.DRG_Indicator)}
                        </td>
                        <td className="tableData">
                            {"Payment_Method" in data &&
                                data.Payment_Method.value !== undefined
                                ? convertToCase(data.Payment_Method.value)
                                : convertToCase(data.Payment_Method)}
                        </td>
                        <td className="tableData">
                            {"Payment_Number" in data &&
                                data.Payment_Number.value !== undefined
                                ? convertToCase(data.Payment_Number.value)
                                : convertToCase(data.Payment_Number)}
                        </td>
                        <td className="tableData">
                            {"Filed_Timely" in data &&
                                data.Filed_Timely.value !== undefined
                                ? convertToCase(data.Filed_Timely.value)
                                : convertToCase(data.Filed_Timely)}
                        </td>
                        <td className="tableData">
                            {"Grant_Good_Cause" in data &&
                                data.Grant_Good_Cause.value !== undefined
                                ? convertToCase(data.Grant_Good_Cause.value)
                                : convertToCase(data.Grant_Good_Cause)}
                        </td>
                        <td className="tableData">
                            {"Good_Cause_Reason" in data &&
                                data.Good_Cause_Reason.value !== undefined
                                ? convertToCase(data.Good_Cause_Reason.value)
                                : convertToCase(data.Good_Cause_Reason)}
                        </td>
                        <td className="tableData">
                            {"Auth_Number" in data &&
                                data.Auth_Number.value !== undefined
                                ? convertToCase(data.Auth_Number.value)
                                : convertToCase(data.Auth_Number)}
                        </td>
                        <td className="tableData">
                            {"Number_of_Days_in_Span" in data &&
                                data.Number_of_Days_in_Span.value !== undefined
                                ? formatDate(data.Number_of_Days_in_Span.value)
                                : formatDate(data.Number_of_Days_in_Span)}
                        </td>
                        <td className="tableData">
                            {"Service_Start_Date" in data &&
                                data.Service_Start_Date.value !== undefined
                                ? formatDate(data.Service_Start_Date.value)
                                : formatDate(data.Service_Start_Date)}
                        </td>
                        <td className="tableData">
                            {"Service_End_Date" in data &&
                                data.Service_End_Date.value !== undefined
                                ? formatDate(data.Service_End_Date.value)
                                : formatDate(data.Service_End_Date)}
                        </td>
                        <td className="tableData">
                            {"Claim_Status" in data &&
                                data.Claim_Status.value !== undefined
                                ? formatDate(data.Claim_Status.value)
                                : formatDate(data.Claim_Status)}
                        </td>
                        <td className="tableData">
                            {"Claim_Adjusted_Date" in data &&
                                data.Claim_Adjusted_Date.value !== undefined
                                ? formatDate(data.Claim_Adjusted_Date.value)
                                : formatDate(data.Claim_Adjusted_Date)}
                        </td>
                        <td className="tableData">
                            {"Payment_Date" in data &&
                                data.Payment_Date.value !== undefined
                                ? formatDate(data.Payment_Date.value)
                                : formatDate(data.Payment_Date)}
                        </td>
                        <td className="tableData">
                            {"Payment_Mail_Date_Postmark" in data &&
                                data.Payment_Mail_Date_Postmark.value !== undefined
                                ? formatDate(data.Payment_Mail_Date_Postmark.value)
                                : formatDate(data.Payment_Mail_Date_Postmark)}
                        </td>
                        <td className="tableData">
                            {"Allowed_Amount" in data &&
                                data.Allowed_Amount.value !== undefined
                                ? convertToCase(data.Allowed_Amount.value)
                                : convertToCase(data.Allowed_Amount)}
                        </td>
                        <td className="tableData">
                            {"Billed_Amount" in data &&
                                data.Billed_Amount.value !== undefined
                                ? convertToCase(data.Billed_Amount.value)
                                : convertToCase(data.Billed_Amount)}
                        </td>
                    </tr>
                );
            });
        }
    };

    const formatDate = (dateObj) => {
        console.log("Inside formatDate ", typeof dateObj);

        if (dateObj) {
            if (typeof dateObj === "string") {
                const localDate = new Date(Date.parse(dateObj));

                console.log(
                    "Inside formatDate typeof",
                    Date.parse(dateObj),
                    localDate.getDate()
                );
                dateObj = localDate;
            } else if (typeof dateObj === "number") {
                const localDate2 = new Date(dateObj);

                console.log("Inside formatDate typeof: ", localDate2.getDate());
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

    const decreaseDataIndex = () => {
        if (operationValue === "Add" || operationValue === "Force Delete") {
            const indx = dataIndex - 1;
            setDataIndex(indx);
        }
    };

    const handleOperationValue = (oprtnValue) => {
        setOperationValue(oprtnValue);
    };

    const handleModalChange = (flag) => {
        // setDataIndex({
        //     ...dataIndex,
        //     ...opertnData
        // });
        //console.log("Handle Modal Change Data Index After: ",dataIndex);
        setModalShow(flag);
    };

    const handleDataIndex = (index) => {
        //console.log("Inside setDataIndex: ",index);
        setDataIndex(index);
    };

    return (
        <>
            <table className="table table-bordered tableLayout" id="ClaimInformationTable">
                <thead>
                    <tr className="tableRowStyle tableHeaderColor">
                        {lockStatus == "N" && (
                            <th style={{ width: "7.5%" }}>
                                <button
                                    className="addBtn"
                                    onClick={() => {
                                        addTableRows(ClaimInformationTable.displayName);
                                        handleModalChange(true);
                                        handleDataIndex(claimInformationGridData.length);
                                        handleOperationValue("Add");
                                    }}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </th>
                        )}
                        {lockStatus == "V" && <th style={{ width: "7.5%" }}></th>}
                        <th scope="col">Issue Number</th>
                        <th scope="col">Line Number</th>
                        <th scope="col">Patient Ref/Account Number</th>
                        <th scope="col">Place of Service</th>
                        <th scope="col">Procedure/ Diagnosis Code 2</th>
                        <th scope="col">Procedure/ Diagnosis Code(s)</th>
                        <th scope="col">Provider Account Number</th>
                        <th scope="col">DRG Indicator</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Payment Number</th>
                        <th scope="col">Filed Timely</th>
                        <th scope="col">Grant Good Cause</th>
                        <th scope="col">Good Cause Reason</th>
                        <th scope="col">Auth Number</th>
                        <th scope="col">Number of Days in Span</th>
                        <th scope="col">Service Start Date</th>
                        <th scope="col">Service End Date</th>
                        <th scope="col">Claim Status</th>
                        <th scope="col">Claim Adjusted Date</th>
                        <th scope="col">Payment Date</th>
                        <th scope="col">Payment Mail Date (PostMark)</th>
                        <th scope="col">Allowed Amount</th>
                        <th scope="col">Billed Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {tdData()}
                </tbody>
            </table>
            <GridModal
                name={"Claim Information"}
                validationObject={isTouched}
                modalShow={modalShow}
                handleModalChange={handleModalChange}
                dataIndex={dataIndex}
                tdDataReplica={tdDataReplica}
                deleteTableRows={deleteTableRows}
                gridName={ClaimInformationTable.displayName}
                decreaseDataIndex={decreaseDataIndex}
                operationValue={operationValue}
                gridRowsFinalSubmit={gridRowsFinalSubmit}
                lockStatus={lockStatus}
            ></GridModal>
        </>
    );
}
