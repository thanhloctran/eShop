import React, { Component } from "react";
import "./Menu.css";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import Icon from "@material-ui/core/Icon";
import { getMenuDataAction } from './../../Redux/Actions/Data'


class ConnectedMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Keep track of expanded title items in menu
      expandedItems: this.props.categoryData.reduce((accum, current) => {
        if (current.type === "title") {
          accum[current.id] = true;
        }
        return accum;
      }, {})
    };

  }
  componentWillMount() {
    this.props.getMenuData();
  }
  componentDidMount() {
    loadCSS("https://use.fontawesome.com/releases/v5.1.0/css/all.css");


  }

  render() {
    if (!this.props.showMenu) return null;
    return (
      <div className="menu" >
        {
          this.props.categoryData
            .filter(y => {
              // If needed, filter some menu items first.
              if (y.parentID && !this.state.expandedItems[y.parentID]) return false;
              if (y.protected && !this.props.loggedInUser) return false;
              return true;
            })
            .map((x, i) => {
              if (x.type === "item") {
                return (
                  <NavLink
                    to={x.url}
                    exact
                    isActive={(_, location) => {

                      // If there is a query string, we have some manual way to decide which menu item is active.
                      if (location.search) {
                        let categoryFromQS = queryString.parse(location.search)
                          .category;
                        let isDirectClick =
                          queryString.parse(location.search).term === undefined;
                        return isDirectClick && x.name === categoryFromQS;
                      }

                      return x.url === location.pathname;
                    }}
                    style={{
                      textDecoration: "none",
                      color: "rgb(32, 32, 34)",
                      marginLeft: 10
                    }}
                    key={x.id}
                    activeStyle={{
                      color: "#4282ad"
                    }}
                  >
                    <div className="menuItem">
                      <Icon
                        className={x.icon}
                        style={{ fontSize: 22, width: 30, marginRight: 10 }}
                      />
                      {x.name}
                    </div>
                  </NavLink>
                );
              } else if (x.type === "title") {
                return (
                  <div
                    key={x.id}
                    className="menuTitle"
                    onClick={() => {
                      this.setState(ps => {
                        return {
                          expandedItems: {
                            ...ps.expandedItems,
                            [x.id]: !ps.expandedItems[x.id]
                          }
                        };
                      });
                    }}
                  >
                    <span style={{ flex: 1 }}>{x.name}</span>
                    {this.state.expandedItems[x.id] ? <ExpandLess /> : <ExpandMore />}
                  </div>
                );
              }

              return null;
            })}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    showMenu: state.rootReducer.showMenu,
    checkedOutItems: state.rootReducer.checkedOutItems,
    loggedInUser: state.rootReducer.loggedInUser,
    categoryData: state.rootReducer.categoryData,
    // expandedItems: state.rootReducer.expandedItems,

  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getMenuData: () => {
      dispatch(getMenuDataAction())
    }
  }
}

const Menu = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectedMenu));
export default Menu;