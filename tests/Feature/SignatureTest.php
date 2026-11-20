<?php

namespace Tests\Feature;

use Tests\TestCase;

class SignatureTest extends TestCase
{
    public function test_the_layout_starts_with_the_signature_comment(): void
    {
        $html = $this->get('/')->assertOk()->getContent();

        $this->assertIsString($html);
        $this->assertMatchesRegularExpression('/^\s*<!DOCTYPE html>\s*<!--.*Designed & built by Mauricio Masias\.\s*https:\/\/masias\.co\.uk.*-->\s*<html/si', $html);
    }
}
