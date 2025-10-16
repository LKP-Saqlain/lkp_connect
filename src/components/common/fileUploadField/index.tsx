import { Button, Col, Input } from "reactstrap";

const FileUploadField = ({
  label,
  fieldName,
  fileRef,
  file,
  onDelete,
  error,
  touched,
  onChange,
  accept = ".pdf,.doc,.docx",
}: {
  label: any;
  fieldName: string;
  fileRef: React.RefObject<HTMLInputElement>;
  file: File | null;
  onDelete: () => void;
  error?: string;
  touched?: boolean;
  onChange: (file: File) => void;
  accept?: string;
}) => {
  return (
    <Col lg={12}>
      <label style={{ fontSize: "12px" }} className="form-label">
        {label}
      </label>
      <Input
        name={fieldName}
        innerRef={fileRef}
        type="file"
        accept={accept}
        className="form-control"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            onChange(selectedFile);
          }
        }}
        style={{ width: "100%", minHeight: "40px" }}
      />
      {touched && error && <p className="text-error">{error}</p>}
      {file && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <p>File: {file.name}</p>
          <Button
            variant="contained"
            style={{ backgroundColor: "#11395C" }}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      )}
    </Col>
  );
};

export default FileUploadField;
