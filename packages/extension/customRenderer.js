const less = require("less");

module.exports = (css, { fileName, logger }) => {
  try {
    let transformedCss;
    let sourceMap;

    less.render(
      css,
      {
        filename: fileName,
        sourceMap: true,
      },
      (err, output) => {
        if (err) {
          logger.error(err.message);
          return;
        }

        sourceMap = output.map;

        transformedCss = output.css.toString();
      }
    );

    return { css: transformedCss, map: sourceMap };
  } catch (error) {
    logger.error(error.message);
  }
};
