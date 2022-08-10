/**
 * Whoami response dto.
 */
export interface WhoAmIResponseDTO {
  SelectedTab: string;
  CountryRegionCode: string;
}

/**
 * Access identifiers response.
 */
export interface AccessIdentifiersResponseDTO {
  uuid: string;
  customerUuid: string;
  AI?: string;
}
