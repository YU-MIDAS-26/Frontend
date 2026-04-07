/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
import { createGlobalStyle } from "styled-components";

const ResetStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

/* 추가 설정들 */

* {
    box-sizing: border-box; /* 패딩을 줘도 박스가 안 커짐 */
  }

  a {
    text-decoration: none; /* 링크 밑줄 제거 */
    color: inherit;       /* 링크 색상을 부모 글자색이랑 맞춤 */
  }

  @font-face {
    font-family: "ONE Mobile Regular";
    src: url("/fonts/ONE Mobile Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "ONE Mobile Title";
    src: url("/fonts/Title.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --font-body: "ONE Mobile", system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-title: "Midas Title", "ONE Mobile", system-ui, sans-serif;
  }

  body {
    line-height: 1;
    font-family: var(--font-body);
  }

  .font-title {
    font-family: var(--font-title);
  }
`;
export default ResetStyle;
