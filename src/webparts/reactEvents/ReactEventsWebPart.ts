import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";

import * as strings from "ReactEventsWebPartStrings";
import ReactEventsContainer from "./components/ReactEventsContainer";
import { IReactEventsContainerProps } from "./components/IReactEventsContainerProps";
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";

export interface IReactEventsWebPartProps {
  listId: string;
  timeZone: string;
}

export default class ReactEventsWebPart extends BaseClientSideWebPart<
  IReactEventsWebPartProps
> {
  public render(): void {
    const element: React.ReactElement<
      IReactEventsContainerProps
    > = React.createElement(ReactEventsContainer, {
      siteUrl: this.context.pageContext.web.absoluteUrl,
      listId: this.properties.listId,
      timeZone: this.properties.timeZone
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker("listId", {
                  label: strings.EventsListPickerLabel,
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: "listIdPicker"
                }),
                PropertyPaneTextField("timeZone", {
                  label: strings.TimeZoneTextFieldLabel,
                  placeholder: "Asia/Hong_Kong"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
