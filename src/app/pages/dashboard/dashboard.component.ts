import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Chart from 'chart.js';


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    public canvas: any;
    public ctx;
    public chartColor;
    public chartEmail;
    public chartHours;

    public historicalRaw: any;
    public datesArr: string[] = [];
    public confirmedArr: number[] = [];

    constructor(private http: HttpClient) {


    }

    ngOnInit() {

        //
        //get historical data
        this.http.get("./assets/json/history-sg.json").subscribe(data => {
            this.historicalRaw = data;
            console.log(data);
            //break into dates
            var history = data["history"];
            Object.keys(history).forEach((key) => {
                this.datesArr.push(key.split(" ")[0]);
                this.confirmedArr.push(history[key]);                
            });
            console.log("generate graph");
            this.generateGraph(this.datesArr, this.confirmedArr);
        });
    }

    generateGraph(xaxis,inputData) {
        this.chartColor = "#FFFFFF";
        
        var speedCanvas = document.getElementById("speedChart");

        var dataFirst = {
            data: inputData,
            fill: false,
            borderColor: '#fbc658',
            backgroundColor: 'transparent',
            pointBorderColor: '#fbc658',
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8,
        };

        var speedData = {
            labels: xaxis,
            datasets: [dataFirst]
        };

        var chartOptions = {
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            legend: {
                display: false,
                position: 'top'
            }
        };

        var lineChart = new Chart(speedCanvas, {
            type: 'line',
            hover: false,
            data: speedData,
            options: chartOptions
        });
    }
}
