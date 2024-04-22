import { TestBed } from '@angular/core/testing';
import { VoiceService } from './api/voice.service';
import { SpeechService } from './speech.service';

describe('SpeechService', () => {
  let service: SpeechService;
  let voiceServiceSpy: jasmine.SpyObj<VoiceService>;

  beforeEach(() => {
    voiceServiceSpy = jasmine.createSpyObj<VoiceService>(['speak']);
    TestBed.configureTestingModule({
      providers: [
        SpeechService,
        { provide: VoiceService, useValue: voiceServiceSpy },
      ],
    });
    service = TestBed.inject(SpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
