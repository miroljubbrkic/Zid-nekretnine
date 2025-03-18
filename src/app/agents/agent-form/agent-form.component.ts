import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Agent } from 'src/app/auth/agent.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-agent-form',
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.css']
})
export class AgentFormComponent implements OnInit {


  agentForm!: FormGroup
  agentId!: string | null
  agent!: any
  isLoading = false

  constructor(private authService: AuthService) {}




  ngOnInit(): void {

    this.agentForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      ime: new FormControl(null, Validators.required),
      prezime: new FormControl(null, Validators.required),
      telefon: new FormControl(null, Validators.required),
      lozinka: new FormControl(null, Validators.minLength(6)) // Lozinka nije obavezna
    });

    this.isLoading = true
    this.agentId = this.authService.getAgentId()

    if (this.agentId)
    this.authService.getAgentById(this.agentId).subscribe(agentData => {
      this.isLoading = false
      this.agent = agentData.agent
      
      this.agentForm.patchValue({
        email: agentData.agent.email,
        ime: agentData.agent.ime,
        prezime: agentData.agent.prezime,
        telefon: agentData.agent.telefon
      });


    })    

  }


  onSaveAgent() {
    if (this.agentForm.invalid) {
      return
    }

    this.isLoading = true
    if (this.agentId)
    this.authService.updateAgent(
      this.agentId, 
      this.agentForm.value.ime, 
      this.agentForm.value.prezime,
      this.agent.email, 
      this.agentForm.value.telefon)
  }







}
