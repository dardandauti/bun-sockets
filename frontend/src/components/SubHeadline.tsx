const SubHeadline = ({
  content,
  id,
  onChange,
  onFocus,
  onBlur,
  borderColor,
}: {
  content: string;
  id: string;
  onChange: (id: string, value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  borderColor: string;
}) => {
  return (
    <input
      type="text"
      value={content}
      onChange={(e) => onChange(id, e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Enter SubHeader"
      style={{
        fontWeight: "bold",
        fontSize: "24px",
        width: "100%",
        border: `2px solid ${borderColor}`,
        outline: "none",
        textAlign: "left",
        color: "#555",
      }}
    />
  );
};
export default SubHeadline;
