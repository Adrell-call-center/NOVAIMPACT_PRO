const ModernAgencyAbout = () => {
  return (
    <>
      <section className="award__area-8">
        <div className="award__video-8">
          <div className="award__text-8">
            <a href="#">
              <h2 className="title">
                Strategy, Design, Solution <br /> Development{" "}
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </h2>
            </a>
          </div>

          <video loop muted autoPlay playsInline>
            <source src="assets/video/video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default ModernAgencyAbout;
