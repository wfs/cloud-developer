import * as React from "react";

interface NotFoundProps {}

interface NotFoundState {}

export class NotFound extends React.PureComponent<
  NotFoundProps,
  NotFoundState
> {
  /**
   * Renders not found
   * @returns
   */
  render() {
    return <h1>Not Found</h1>;
  }
}
