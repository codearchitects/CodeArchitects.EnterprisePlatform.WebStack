import { InjectionToken } from '@angular/core';
import { SerializerOptions } from '@ca-webstack/reflection';

/**
 * Injection token for providing custom serializer configuration options.
 */
export const CAEP_SERIALIZER_CONFIG = new InjectionToken<SerializerOptions>('SERIALIZER_CONFIG');