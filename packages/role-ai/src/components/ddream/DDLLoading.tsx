import classes from './DDLLoading.module.scss'

export default DDLLoading

function DDLLoading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="500"
      height="500"
      viewBox="0 0 500 500"
      fill="none"
      className={`${classes.ddlloading} w-full h-full`}
    >
      <path
        id="s4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M178,58C242.263,58,294.727,108.514,297.853,172.001C298.016,175.311,295.314,178,292,178L64,178C60.6863,178,57.9844,175.311,58.1473,172.001C61.2731,108.514,113.738,58,178,58Z"
        fill="#2ed0ff"
        stroke="none"
        strokeWidth="8"
        fillOpacity="1"
        transform="translate(178,118) translate(-178,-118)"
        className={`${classes.s4}`}
      />
      <path
        id="s3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M58,322C58,257.738,108.514,205.273,172.001,202.147C175.311,201.984,178,204.686,178,208L178,436C178,439.314,175.311,442.016,172.001,441.853C108.514,438.727,58,386.262,58,322Z"
        fill="#2ed0ff"
        stroke="none"
        strokeWidth="8"
        fillOpacity="1"
        transform="translate(118,322) translate(-118,-322)"
        className={`${classes.s3}`}
      />
      <path
        id="s2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M322,442C257.738,442,205.273,391.486,202.147,327.999C201.984,324.689,204.686,322,208,322L436,322C439.314,322,442.016,324.689,441.853,327.999C438.727,391.486,386.263,442,322,442Z"
        fill="#2ed0ff"
        stroke="none"
        strokeWidth="8"
        fillOpacity="1"
        transform="translate(322,382) translate(-322,-382)"
        className={`${classes.s2}`}
      />
      <path
        id="s1"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M442,178C442,242.338,391.486,294.864,327.999,297.993C324.689,298.156,322,295.451,322,292.133L322,63.8665C322,60.5489,324.689,57.8439,327.999,58.007C391.486,61.1364,442,113.662,442,178Z"
        fill="#2ed0ff"
        stroke="none"
        strokeWidth="8"
        fillOpacity="1"
        transform="translate(382,178) translate(-382,-178)"
        className={`${classes.s1}`}
      />
    </svg>
  )
}
