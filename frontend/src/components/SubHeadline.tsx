const SubHeadline = ({
  content,
  onChange,
  onFocus,
  onBlur,
  id,
  borderColor,
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
