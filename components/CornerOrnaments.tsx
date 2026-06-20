"use client"

export default function CornerOrnaments() {
  return (
    <>
      {/* Top-left corner */}
      <div className="corner-bracket top-left">┌──</div>
      {/* Top-right corner */}
      <div className="corner-bracket top-right">──┐</div>
      {/* Bottom-left corner */}
      <div className="corner-bracket bottom-left">└──</div>
      {/* Bottom-right corner */}
      <div className="corner-bracket bottom-right">──┘</div>
    </>
  )
}
