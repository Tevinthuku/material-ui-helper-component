import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

// crocks
import prop from "crocks/Maybe/prop";
import safe from "crocks/Maybe/safe";
import isString from "crocks/predicates/isString";

const styles = theme => ({
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11
  },
  arrowPopper: {
    maxWidth: 300,
    '&[x-placement*="bottom"] $arrowArrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${
          theme.palette.grey[700]
        } transparent`
      }
    },
    '&[x-placement*="top"] $arrowArrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${
          theme.palette.grey[700]
        } transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrowArrow': {
      left: 0,
      marginLeft: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${
          theme.palette.grey[700]
        } transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrowArrow': {
      right: 0,
      marginRight: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${
          theme.palette.grey[700]
        }`
      }
    }
  },
  arrowArrow: {
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  },
  button: {
    margin: theme.spacing.unit
  }
});

class CustomizedTooltips extends React.Component {
  state = {
    arrowRef: null
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  render() {
    const { classes } = this.props;

    const safeIconText = prop("icon", this.props);
    const safeIcon = safeIconText
      .map(icon =>
        safe(isString, icon)
          .map(icon => {
            switch (icon) {
              case "warning":
                return "warning";
              default:
                return "info";
            }
          })
          .option("info")
      )
      .option("info");

    const safeText = prop("text", this.props)
      .map(text => safe(isString, text).option("Hey"))
      .option("Hey");
    return (
      <div>
        <Tooltip
          title={
            <React.Fragment>
              {safeText}
              <span className={classes.arrowArrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          classes={{ popper: classes.arrowPopper }}
          PopperProps={{
            popperOptions: {
              modifiers: {
                arrow: {
                  enabled: Boolean(this.state.arrowRef),
                  element: this.state.arrowRef
                }
              }
            }
          }}
        >
          <IconButton
            className={classes.button}
            style={{
              color: safeIcon === "warning" ? "red" : ""
            }}
          >
            <Icon>{safeIcon}</Icon>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

CustomizedTooltips.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedTooltips);
