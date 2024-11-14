const Bodytext = ({ content, onChange, onFocus, onBlur, id, borderColor }) => {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(id, e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Enter Bodytext"
      style={{
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "1.75",
        width: "100%",
        height: "150px",
        border: `2px solid ${borderColor}`,
        borderRadius: "8px",
        outline: "none",
        color: "#444",
      }}
    />
  );
};
export default Bodytext;
