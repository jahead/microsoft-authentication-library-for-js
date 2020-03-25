/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Authority } from "./Authority";
import { AuthorityType } from "./Authority";
import { ClientConfigurationError } from "../error/ClientConfigurationError";
import { B2CTrustedHostList } from "../utils/Constants";

/**
 * @hidden
 */
export class B2cAuthority extends Authority {
    public static B2C_PREFIX: String = "tfp";
    public constructor(authority: string, validateAuthority: boolean) {
        super(authority, validateAuthority);
    }

    public get AuthorityType(): AuthorityType {
        return AuthorityType.B2C;
    }

    /**
     * Returns a promise with the TenantDiscoveryEndpoint
     */
    public async GetOpenIdConfigurationEndpointAsync(): Promise<string> {
        if (!this.IsValidationEnabled || this.IsInTrustedHostList(this.CanonicalAuthorityUrlComponents.HostNameAndPort)) {
            return this.DefaultOpenIdConfigurationEndpoint;
        }

        throw ClientConfigurationError.createUnsupportedAuthorityValidationError();
    }

    /**
     * Checks to see if the host is in a list of trusted hosts
     * @param {string} The host to look up
     */
    public IsInTrustedHostList(host: string): boolean {
        if (this.IsValidationEnabled && !Object.keys(B2CTrustedHostList).length) {
            throw ClientConfigurationError.createKnownAuthoritiesNotSetError();
        }
        
        return B2CTrustedHostList[host.toLowerCase()];
    }
}
